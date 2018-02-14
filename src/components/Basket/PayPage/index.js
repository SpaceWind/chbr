import React from 'react';
import {View} from 'native-base';
import {
    Image, ImageBackground, WebView, Alert, Platform
} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

import {connect} from "react-redux";

import {signStackStyle} from "../../../routers/SignStack";
import {NavigationActions} from "react-navigation";
import {clearBasket} from "../../../actions/billing";
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import base64 from 'base-64'

class PayPageC extends React.Component {


    state = {};

    callRedirect = false;

    constructor() {
        super();


        this.state.count = 2;
    }

    componentWillMount() {
        this.orderId = this.props.navigation.state.params.order.order_id;
        this.operationId = this.props.navigation.state.params.order.operationId;


        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            console.log(notif);


            if (notif.info) {
                let data = JSON.parse(base64.decode(notif.info));

                if (data.type === "order_payment_result" && this.orderId === data.order_id) {
                    this.end(data.status === "success", !notif.opened_from_tray);
                    this.notificationListener.remove();
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

    }

    componentWillUnmount() {
        this.notificationListener.remove();
    }


    render() {
        const injectedScript = () => {
            var callback = window.postMessage;
            window.payCallback = function (evt) {
                callback(evt)
            };
            window.postMessage = window.originalPostMessage || window.postMessage;
        };
        return <ImageBackground source={require('../../../../assets/images/background/background.png')}
                                style={signStackStyle}>
            <WebView
                onMessage={(evt) => {
                    this._onMessage(evt.nativeEvent.data)
                }}
                scalesPageToFit={false}
                injectedJavaScript={`(${String(injectedScript)})()`}
                source={{uri: `https://api.chesterapp.ru/api/orders/${this.orderId}/pay`}}

            />
        </ImageBackground>
    }


    _onMessage(data) {
        this.end(data === "payment_success");
    }

    end(success, redirect = true) {
        if (!this.callRedirect) {
            if (success) {
                this.callRedirect = true;
                this.props.clearBasket();


                if (redirect) {
                    const resetAction = NavigationActions.reset({
                        index: 1,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'Restaurants'
                            }),
                            NavigationActions.navigate({
                                routeName: 'RestaurantLunchHistory',
                                params: {
                                    name: this.props.navigation.state.params.type === "out" ? "Заказ на вынос" : "Ланч в ресторане",
                                    operationId: this.operationId,
                                    resultId: this.orderId
                                }
                            })
                        ]
                    });
                    this.props.navigation.dispatch(resetAction);
                }


            }
            else {
                this.callRedirect = true;

                if (redirect) {
                    const resetAction = NavigationActions.back();
                    this.props.navigation.dispatch(resetAction);
                }

                Alert.alert(
                    'Платеж не прошел',
                    'Повторите еще раз или обратитесь в поддержку',
                    [

                        {
                            text: 'Ок', onPress: () => {

                        }
                        }
                    ]
                );

            }
        }

    }

}

function bindAction(dispatch) {
    return {
        clearBasket: () => {
            dispatch(clearBasket());
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    billing: state.billing
});
const PayPage = connect(mapStateToProps, bindAction)(PayPageC);
export default PayPage;

const styles = {
    container: {
        flex: 1,
    },

    header: {
        marginHorizontal: 16,
        marginTop: 15
    },
    headerOrderNumber: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
    headerText: {
        marginTop: 5,
        color: platform.brandWarningAccent,
        fontSize: 28,
        lineHeight: 40,
    },
    headerRestaurant: {
        color: '#fff',
        fontSize: 20,
        lineHeight: 29,
    },
    peopleCount: {
        marginTop: 23,
    },
    peopleCountText: {
        marginHorizontal: 16,
        marginBottom: 7,
        color: platform.brandFontAccent,
        fontSize: 14,
        lineHeight: 20
    },
    payment: {
        marginTop: 15
    },
    paymentText: {
        marginHorizontal: 16,
        marginBottom: 15,
        fontSize: 22,
        lineHeight: 31,
    },
    deviceCount: {
        marginTop: 15,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deviceCountText: {
        color: '#B3BBC1',
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 20,
    },
    changeCountItemButton: {
        flexDirection: 'row'
    },
    minusItemButton: {
        height: 34,
        width: 37,
        borderBottomLeftRadius: 34,
        borderTopLeftRadius: 34,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: "center"
    },
    plusItemButton: {
        height: 34,
        width: 37,
        borderBottomRightRadius: 34,
        borderTopRightRadius: 34,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: "center",
        overflow: 'hidden'
    },
    counterItemButton: {
        height: 34,
        width: 40,
        backgroundColor: platform.brandWarning,
        justifyContent: "center",
        alignItems: "center"
    },
    counterItemButtonText: {
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 26,
        textAlign: "center"

    },

    bottom: {
        marginTop: 16,
        paddingTop: 15,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        backgroundColor: '#2B3034',
        borderColor: platform.brandDivider,
        width: '100%',
        alignItems: 'center'
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%'
    },
    priceText: {
        fontSize: 18,
        lineHeight: 20,
    },


    submit: {
        marginTop: 5,
        justifyContent: 'center'
    },
    mark: {
        fontSize: 13,
        lineHeight: 18,
        color: '#fff',
        marginVertical: 8
    },


    card: {
        backgroundColor: '#2B3034',
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        width: '100%'
    },
    cardImage: {
        width: 40,
        marginRight: 16,
        alignItems: 'center'
    },
    cardText: {
        fontSize: 20,
        lineHeight: 20
    },
    cardTextMain: {
        marginLeft: 'auto'
    },
    cardButtonText: {
        fontSize: 18,
        lineHeight: 20,
        color: platform.brandListItem
    },
};