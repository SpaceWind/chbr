import React from 'react';
import {Image, StyleSheet, View, StatusBar} from 'react-native';
import SignStack, {signStackStyle} from "./routers/SignStack";
import {connect} from "react-redux";
import NavigationDrawer from "./routers/NavigationDrawer";
import {getRestaurants} from "./actions/restaurant";
import {Text, variables} from "native-base";
import Api from "./actions/api/api"
import TutorialPage from "./components/Tutorial/index";
import {Platform} from 'react-native';

import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import {sendPushToken} from "./actions/user";

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
        FCM.presentLocalNotification({
            vibrate: 500,
            title: notif.fcm.title,
            body: notif.fcm.body,
            priority: "high",
            show_in_foreground: true
        })
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

    constructor(props) {
        super(props);

        variables.androidRipple = false;
    }

    componentWillMount() {

    }


    componentDidMount() {
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
            FCM.presentLocalNotification({
                vibrate: 500,
                title: notif.fcm.title,
                body: notif.fcm.body,
                priority: "high",
                show_in_foreground: true
            })
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

    async loadPrefetch() {


        let restaurants = await this.props.getRestaurants();
        if (restaurants.restaurants) {
            Object.keys(restaurants.restaurants).forEach((item, i) => {
                //Image.prefetch(restaurants.restaurants[item].photos[0].url);
            });
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isLoading !== nextProps.isLoading) {
            this.loadPrefetch();
        }

        if (nextProps.user.token) {
            if(nextProps.user.token!==this.props.user.token)
            {
                Api.jwt(nextProps.user.token);
                if(this.token)
                {
                    this.props.sendPushToken(this.token);
                }
            }

        }
        else {
            Api.jwt(null);
        }
    }


    state = {
        lockMode: 'locked-closed'
    }

    render() {

        StatusBar.setBarStyle('light-content', true);
        if (this.props.isLoading) {
            return <View></View>
        }

        if (this.props.showTutorial) {
            return (
                <Image source={require('../assets/images/login&registration/login-bg.png')} style={signStackStyle}>
                    <TutorialPage/>
                </Image>
            )
        }

        if (this.props.showSign) {
            return (
                <Image source={require('../assets/images/login&registration/login-bg.png')} style={signStackStyle}>

                    <SignStack/>


                </Image>

            )
        }
        return (
            <Image source={require('../assets/images/background/background.png')} style={signStackStyle}>
                <NavigationDrawer style={{backgroundColor: '#000'}}
                                  onNavigationStateChange={(prevState, newState, action) => {

                                      /*let drawerEnable = newState.routes[0].routes.find((ele) => {
                                          return ele.index !== 0;
                                      });
                                      if (drawerEnable.index && drawerEnable.index >= 1) {
                                          this.setState({lockMode: 'locked-closed'});
                                      } else {
                                          this.setState({lockMode: 'unlocked'});
                                      }*/

                                  }}/>
            </Image>
        );
    }
}


function bindAction(dispatch) {
    return {
        getRestaurants: () => {
            return dispatch(getRestaurants());
        },
        sendPushToken: (token) => {
            return dispatch(sendPushToken(token));
        }
    };
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    restaurants: state.restaurant.restaurants,
    user: state.user,
    showSign: state.user.showSign,
    showTutorial: state.user.showTutorial
});
const Chester = connect(mapStateToProps, bindAction)(App);

export default Chester;

