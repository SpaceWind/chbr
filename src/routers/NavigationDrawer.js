import React from 'react';
import {DrawerItems, DrawerNavigator} from 'react-navigation';
import RestaurantsStack from "./RestaurantsStack";
import {Button, Text, View} from "native-base";
import {sendPushToken, setSignState, signOut} from "../actions/user";
import {connect} from "react-redux";
//import {Constants} from 'expo';
import {Image, ScrollView, Platform, Dimensions, ImageBackground} from "react-native";
import UserInfo from "./components/UserInfo/index";
import platform from "../../native-base-theme/variables/platform";
import ChesterIcon from "../components/Common/ChesterIcon/index";
import ProfileStack from "./ProfileStack";
import HistoryStack from "./HistoryStack";
import NewsStack from "./NewsStack";
import FeedBackStack from "./FeedBackStack";
import MyCardStack from "./MyCardStack";

import base64 from 'base-64'

import Constants from "../../utilities/Constants";
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import {NavigationActions} from "react-navigation";

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


        let c = base64.encode('fdfd');
        FCM.requestPermissions().then(() => console.log('granted')).catch(() => console.log('notification permission rejected'));

        FCM.getFCMToken().then(token => {
            console.log(token);
            if (this.props.user.token) {
                this.props.sendPushToken(token);
            }
            this.token = token;
        });

        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            console.log(notif)
            if (notif && notif.local_notification) {
                return
            }
            if (notif.opened_from_tray) {

                //this.props.navigation.navigate('BookTableHistory');

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
            if (this.props.user.token) {
                this.props.sendPushToken(token);
            }
            this.token = token;
        });

        // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
        // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
        FCM.getInitialNotification().then(notif => console.log(notif));
    }

    componentWillUnmount() {
        // stop listening for events
        this.notificationListener.remove();
    }

    componentWillReceiveProps(nextProps) {


        if (nextProps.user.token && nextProps.user.token !== this.props.user.token) {
            if (this.token) {
                this.props.sendPushToken(this.token);
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


    _scanCheck()
    {
        if (this.props.logged) {
            this.props.navigation.navigate('ScanBill');
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
        }
    };
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    user: state.user,
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
