import React from 'react';
import {Image, StyleSheet, View, StatusBar, ImageBackground, Keyboard, Alert} from 'react-native';
import SignStack, {signStackStyle} from "./routers/SignStack";
import {connect} from "react-redux";
import NavigationDrawer from "./routers/NavigationDrawer";
import {getRestaurants} from "./actions/restaurant";
import {Text, variables} from "native-base";
import Api from "./actions/api/api"
import TutorialPage from "./components/Tutorial/index";
import {Platform, Text as ReactText, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info'

import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import {attachDevice, createDevice, hideAlert, sendPushToken, setUID} from "./actions/user";
import {NavigationActions} from "react-navigation";
import UUIDGenerator from 'react-native-uuid-generator';
import SplashScreen from 'react-native-splash-screen'
// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if (notif.local_notification) {
        //this is a local notification
    }
    if (notif.opened_from_tray) {
        //app is open/resumed because user clicked banner
    }
    // await someAsyncCall();

    if (Platform.OS === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom


        console.log(notif);
        switch (notif._notificationType) {
            case NotificationType.Remote:
                notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                break;
            case NotificationType.NotificationResponse:
                notif.finish();
                break;
            case NotificationType.WillPresent:
                notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                break;
        }
    }
});


class App extends React.Component {

    props: {
        basket?: boolean
    };

    token = null;

    state = {
        lockMode: 'locked-closed'
    };

    constructor(props) {
        super(props);
        ReactText.defaultProps.allowFontScaling = false;
        Text.defaultProps.allowFontScaling = false;
        variables.androidRipple = false;
    }

    componentWillMount() {


    }


    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        if (this.props.isLoading !== nextProps.isLoading) {
            setTimeout(() => {
                SplashScreen.hide();
            }, 50);
            this.loadPrefetch();
            this._checkUID();
        }

        if (nextProps.user.token) {
            if (nextProps.user.token !== this.props.user.token) {
                Api.jwt(nextProps.user.token);
                if (this.token) {
                    this.props.sendPushToken(this.token);
                }
            }

        }
        else {
            Api.jwt(null);
        }
        if (nextProps.alert && (nextProps.alert !== this.props.alert || this.props.alert && nextProps.alert.title !== this.props.alert.title)) {
            this._showAlert(nextProps.alert);

        }
    }


    render() {

        StatusBar.setBarStyle('light-content', true);
        if (this.props.isLoading) {
            return <View>
                <Text>.</Text>
            </View>
        }

        if (this.props.showTutorial) {
            return (
                <ImageBackground source={require('../assets/images/login&registration/login-bg.png')}
                                 style={signStackStyle}>

                    <TutorialPage/>
                </ImageBackground>
            )
        }

        if (this.props.showSign) {
            return (
                <ImageBackground source={require('../assets/images/login&registration/login-bg.png')}
                                 style={signStackStyle}>

                    <SignStack/>


                </ImageBackground>

            )
        }
        return (
            <ImageBackground source={require('../assets/images/background/background.png')} style={signStackStyle}>
                <NavigationDrawer style={{backgroundColor: '#000'}}
                                  onNavigationStateChange={(prevState, newState, action) => {

                                      Keyboard.dismiss()

                                  }}/>

            </ImageBackground>
        );
    }

    _showAlert(alert) {
        setTimeout(() => {
            Alert.alert(
                alert.title,
                alert.message,
                [
                    {
                        text: 'Ок'
                        , onPress: () => {
                    }
                    }
                ]
            );
        }, 100);
        this.props.hideAlert();

    }

    async _checkUID() {
        if (this.props.user && this.props.user.uid === null) {
            try {
                let uid = DeviceInfo.getUniqueID();
                this.props.setUID(uid);
                let device = {
                    screen_width: Dimensions.get('window').width,
                    screen_height: Dimensions.get('window').height,
                    vendor: DeviceInfo.getBrand(),
                    model: DeviceInfo.getModel(),
                    os: DeviceInfo.getSystemName(),
                    os_version: DeviceInfo.getSystemVersion(),
                    timezone: DeviceInfo.getTimezone()
                };
                let result = await this.props.createDevice(uid, device);
                if (this.props.user.logged) {
                    this.props.attachDevice(uid);
                }
            }
            catch (ex) {

            }
        }
    }

    async loadPrefetch() {


        let restaurants = await this.props.getRestaurants();
        if (restaurants.restaurants) {
            Object.keys(restaurants.restaurants).forEach((item, i) => {
                //Image.prefetch(restaurants.restaurants[item].photos[0].url);
            });
        }


    }


}


function bindAction(dispatch) {
    return {
        getRestaurants: () => {
            return dispatch(getRestaurants());
        },
        setUID: (uid) => {
            dispatch(setUID(uid));
        },
        createDevice: (uid, device) => {
            return dispatch(createDevice(uid, device));
        },
        attachDevice: (uid) => {
            return dispatch(attachDevice(uid));
        },
        hideAlert: () => {
            return dispatch(hideAlert());
        }
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    restaurants: state.restaurant.restaurants,
    user: state.user,
    alert: state.user.alert,
    showSign: state.user.showSign,
    showTutorial: state.user.showTutorial
});
const Chester = connect(mapStateToProps, bindAction)(App);

export default Chester;

