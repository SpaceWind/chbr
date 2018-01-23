import React from 'react';
import {DrawerItems, DrawerNavigator} from 'react-navigation';
import RestaurantsStack from "./RestaurantsStack";
import {Button, Text, View} from "native-base";
import {clearRequestData, getOperation, sendPushToken, setSignState, signOut} from "../actions/user";
import {connect} from "react-redux";
//import {Constants} from 'expo';
import {Image, ScrollView, Platform, Dimensions, ImageBackground, Alert} from "react-native";
import UserInfo from "./components/UserInfo/index";
import platform from "../../native-base-theme/variables/platform";
import ChesterIcon from "../components/Common/ChesterIcon/index";
import ProfileStack from "./ProfileStack";
import HistoryStack from "./HistoryStack";
import NewsStack from "./NewsStack";
import FeedBackStack from "./FeedBackStack";
import MyCardStack from "./MyCardStack";
import Permissions from 'react-native-permissions'
import base64 from 'base-64'

import Constants from "../../utilities/Constants";
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import {NavigationActions} from "react-navigation";
import {getNews, getOneNews} from "../actions/news";

export default NavigationDrawer = DrawerNavigator({
        Restaurant: {
            screen: RestaurantsStack,
            navigationOptions: {
                title: 'Рестораны',
                lockMode: 'locked-closed'
            }
        },
        MyCard: {
            screen: MyCardStack,
            navigationOptions: {
                title: 'Моя карта'
            }
        },
        News2: {
            screen: NewsStack,
            navigationOptions: {
                title: 'Акции & Новости'
            }
        },
        History: {
            screen: HistoryStack,
            navigationOptions: {
                title: 'История заказов'
            }
        },
        FeedBack: {
            screen: FeedBackStack,
            navigationOptions: {
                title: 'Связаться с нами'
            }
        },
        Profile: {
            screen: ProfileStack,
            navigationOptions: {
                title: 'Ваш профиль'
            }
        }
    },
    {
        cardStyle: {
            backgroundColor: '#2B3034',
        },
        contentComponent: (props) => <CustomNavigationDrawerSwag disableGestures={true} {...props}/>
    });


class CustomNavigationDrawer extends React.Component {


    componentWillMount() {

        FCM.requestPermissions().then(() => {
            if (!this.props.user.disabledPush) {
                FCM.subscribeToTopic('common_notifications');
                console.log('subsribes');
            }
        });

        FCM.getFCMToken().then(token => {
            console.log(token);
            if (this.props.user.token && this.props.user.logged) {
                this.props.sendPushToken(token);
            }
            this.token = token;
        });


        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            console.log(notif);
            if (notif && notif.local_notification) {
                return
            }

            if (notif.opened_from_tray) {
                if (notif.info) {
                    let data = JSON.parse(base64.decode(notif.info));
                    if (data.reserve_id) {
                        this.props.getOperation(data.reserve_id);
                        this.props.navigation.navigate('BookTableHistory', {reserveId: data.reserve_id});
                    }
                    if (data.news_id) {
                        this.props.getOneNews(data.news_id);
                        this.props.getNews();
                        this.props.navigation.navigate('OneNewsPage');
                    }
                }
            }


            if (Platform.OS === 'ios') {
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
                        break;
                }
            }
        });
        FCM.on(FCMEvent.RefreshToken, (token) => {
            if (this.props.user.token && this.props.user.logged) {
                this.props.sendPushToken(token);
            }
            this.token = token;
        });


        if (this.props.logged && this.props.user && this.props.userData && this.props.requestData) {
            if (!(this.props.userData.first_name || this.props.userData.last_name || this.props.userData.email || this.props.userData.avatar)) {
                this.props.navigation.navigate('Profile');
                this.props.clearRequestData();
            }
        }

    }

    componentWillUnmount() {
        // stop listening for events
        this.notificationListener.remove();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user.token && nextProps.user.token !== this.props.user.token && nextProps.user.isCodeConfirmed) {
            if (this.token) {
                this.props.sendPushToken(this.token);
            }
        }
        if (nextProps.user.disabledPush !== this.props.user.disabledPush) {

            if (!nextProps.user.disabledPush) {
                FCM.subscribeToTopic('common_notifications');
            }
            else {
                FCM.unsubscribeFromTopic('common_notifications');
            }
        }
    }

    render() {

        let button = null;
        if (this.props.logged) {
            button = <Button onPress={() => this.props.logOut()}>
                <Text uppercase={false}>
                    Выйти
                </Text>
            </Button>

        } else {
            button = <Button onPress={() => this.props.signIn()}>
                <Text uppercase={false}>
                    Войти
                </Text>
            </Button>
        }


        return (
            <ImageBackground source={require('../../assets/images/navigation/nav-bg.png')} style={styles.background}>


                <View style={styles.userInfo}>
                    <UserInfo showName={true}   {...this.props} />
                </View>

                <DrawerItems {...this.props}
                             activeTintColor={platform.brandWarning}
                             activeBackgroundColor="transparent"
                             labelStyle={styles.drawerItemsText}
                             style={{marginTop: -20}}
                             inactiveTintColor="#fff"
                             items={this.props.items.filter((item) => {
                                 return item.key !== 'Profile' && item.key !== 'Корзина' && item.key !== 'ScanBill'
                             })}

                />


                <Button bordered warning rounded style={styles.scanBarButton}>
                    <ChesterIcon name="camera-24" size={20} color={platform.brandWarning}
                                 style={{marginTop: -5, paddingRight: 5}}/>
                    <Text style={styles.scanBarButtonText} uppercase={false} onPress={() => {


                        this._scanCheck();


                    }}>Сканировать чек</Text>
                </Button>


            </ImageBackground>
        )
    }


    async _scanCheck() {
        if (this.props.logged) {
            let permission = await Permissions.check('camera');
            if (permission === 'undetermined') {
                permission = await Permissions.request('camera');
            }

            if (permission === 'authorized') {
                this.props.navigation.navigate('ScanBill');
            }
            else {
                Alert.alert(
                    'У ChesterApp нет доступа к камере. Чтобы предоставить доступ перейдите в Настройки и включите Камеру.',
                    '',
                    [
                        {
                            text: 'Отменить',
                            onPress: () => {
                            },
                            style: 'cancel',
                        },
                        {text: 'Настройка', onPress: Permissions.openSettings}
                    ],
                )
            }


        }
        else {
            this.props.signIn();
        }
    }
}

function bindAction(dispatch) {
    return {
        signIn: () => dispatch(setSignState(true)),
        sendPushToken: (token) => {
            return dispatch(sendPushToken(token));
        },
        getOperation: (operationId) => {
            dispatch(getOperation(operationId));
        },
        getNews: () => {
            return dispatch(getNews());
        },
        getOneNews: (id) => {
            return dispatch(getOneNews(id));
        },
        clearRequestData: (id) => {
            return dispatch(clearRequestData());
        }
    };
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    user: state.user,
    userData: state.user.userData,
    requestData: state.user.requestData
});

const styles = {
    container: {
        flex: 1
    },
    background: {
        height: Dimensions.get('window').height - (Platform.OS !== 'ios' ? Constants.STATUSBAR_HEIGHT : 0),

        width: null,
        justifyContent: 'space-around'
    },
    userInfo: {},
    drawerItemsText: {
        fontFamily: platform.fontFamily,
        fontSize: 22,
        lineHeight: 31,
        flex: 1,
        textAlign: 'center',
        fontWeight: "normal",
        margin: 0,
        marginTop: 22
    },
    scanBarButton: {
        alignSelf: "center",
        height: 40
    },
    scanBarButtonText: {
        fontSize: 19
    }
};

export const CustomNavigationDrawerSwag = connect(mapStateToProps, bindAction)(CustomNavigationDrawer);

