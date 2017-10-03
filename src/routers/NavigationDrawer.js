import React from 'react';
import {DrawerItems, DrawerNavigator} from 'react-navigation';
import RestaurantsStack from "./RestaurantsStack";
import {Button, Text, View} from "native-base";
import {setSignState, signOut} from "../actions/user";
import {connect} from "react-redux";
//import {Constants} from 'expo';
import {Image, ScrollView} from "react-native";
import UserInfo from "./components/UserInfo/index";
import platform from "../../native-base-theme/variables/platform";
import ChesterIcon from "../components/Common/ChesterIcon/index";
import ProfileStack from "./ProfileStack";
import HistoryStack from "./HistoryStack";
import NewsStack from "./NewsStack";
import FeedBackStack from "./FeedBackStack";
import MyCardStack from "./MyCardStack";

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
            <Image source={require('../../assets/images/navigation/nav-bg.png')} style={styles.background}>


                <ScrollView style={styles.container}>
                    <View style={styles.userInfo}>
                        <UserInfo {...this.props} />
                    </View>

                    <DrawerItems {...this.props}
                                 activeTintColor={platform.brandWarning}
                                 activeBackgroundColor="transparent"
                                 labelStyle={styles.drawerItemsText}
                                 style={{marginTop: -20}}
                                 inactiveTintColor="#fff"
                                 items={this.props.items.filter((item) => {
                                     return item.key !== 'Profile' && item.key !== 'Корзина'
                                 })}

                    />


                    <Button bordered warning rounded style={styles.scanBarButton}>
                        <ChesterIcon name="camera-24" size={20} color={platform.brandWarning}
                                     style={{marginTop: -5, paddingRight: 5}}/>
                        <Text style={styles.scanBarButtonText} uppercase={false}>Сканировать чек</Text>
                    </Button>


                </ScrollView>


            </Image>
        )
    }
}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({});

const styles = {
    container: {
        paddingTop: 30,//Constants.statusBarHeight,
        flex: 1
    },
    background: {
        flex: 1,
        width: null,
        height: null,
    },
    userInfo: {
        marginBottom: 51
    },
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
        marginTop: 63,
        marginBottom: 35,
        height: 36
    },
    scanBarButtonText: {
        fontSize: 19
    }
};

export const CustomNavigationDrawerSwag = connect(mapStateToProps, bindAction)(CustomNavigationDrawer);
