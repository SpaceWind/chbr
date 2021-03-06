import React from 'react';
import {Button, Icon, Switch, Text, View} from 'native-base';
import {
    Image, ImageBackground, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback,
    WebView, LayoutAnimation, Alert
} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import {Platform} from "react-native";
import {connect} from "react-redux";

import {signStackStyle} from "../../../routers/SignStack";
import {InputBlockStyles as inputBlockStyles} from "../../Common/Form/InputBlock/index";
import SelectDate from "../../Restaurant/BookTable/SelectDate";
import InputBlock from "../../Common/Form/InputBlock/index";
import moment from "moment";
import SelectDateOrder from "./SelectDateOrder";
import {buy} from "../../../actions/restaurant";
import {buyApplePay} from "../../../actions/restaurant";
import {getOrder} from "../../../actions/user";
import {clearBasket} from "../../../actions/billing";
import SorryModal from "../../Restaurant/common/SorryModal/index";
import Amount from "../../History/common/Amount/index";
import TextHelper from "../../../../utilities/TextHelper";
import Spinner from "react-native-loading-spinner-overlay";
import {PaymentRequest} from 'react-native-payments';

const currentPlatform = Platform.OS;


class OrderPage extends React.Component {


    state = {
        count: 2,
        maxCount: 20,
        firstname: "",
        lastname: "",
        comment: "",
        email: "",
        send_cheque: 0,
        isOpenOver: false,
        typeLabel: ""
    };

    constructor() {
        super();


        this.state.count = 2;
    }



    componentWillMount() {
        this.type = this.props.navigation.state.params.type;
        this.typeLabel = this.type === 'out' ? "Заказ на вынос" : "Ланч в ресторане"
        this.amount = this.props.navigation.state.params.amount;
        this.dishes =  this.props.navigation.state.params.dishes;
        this.restaurant = this.props.restaurants[this.props.billing.restaurantId];
        let day = moment().locale('en').format('dddd').toLowerCase();
        let timesheet = null;
        if (this.type === "out") {
            timesheet = this.restaurant.schedule_takeouts[day];
            this.start = moment().startOf('day').seconds(timesheet.start);
            this.end = moment().startOf('day').seconds(timesheet.finish);
        }
        else {
            timesheet = this.restaurant.schedule_business_lunch[day];
            this.start = moment().startOf('day').seconds(timesheet.start);
            this.end = moment().startOf('day').seconds(timesheet.finish);
        }

        let currentDate = moment().add(1, "hours");
        if (currentDate < this.start) {
            currentDate = this.start.clone().ceil(15, 'minutes');
        }
        else {
            currentDate = currentDate.ceil(15, 'minutes');
        }

        this.setState({
            date: currentDate,
            firstname: this.props.user.first_name,
            lastname: this.props.user.last_name,
            email: this.props.user.email
        })

    }


    componentWillUnmount() {

    }


    render() {


        return <ImageBackground source={require('../../../../assets/images/background/background.png')}
                                style={signStackStyle}>

            <ScrollView>

                <View style={styles.header}>
                    <Text style={styles.headerText}>{this.typeLabel}</Text>
					          <Text style={styles.headerRestaurant}>{this.restaurant.title_short}</Text>
                </View>
                <Spinner visible={this.props.isBuyPending} textStyle={{color: '#FFF'}}/>

                <SelectDateOrder
                    date={this.state.date}
                    count={this.state.count}
                    maxCount={this.state.maxCount}
                    start={this.start}
                    end={this.end}
                    onDateSelected={(selected) => {
                        this.setState({date: selected.date, count: selected.count});
                    }}/>


                <View style={{
                    borderTopWidth: 1,
                    borderColor: platform.brandDivider,
                    marginTop: 15
                }
                }>

                    <InputBlock name="Имя"
                                keyboardAppearance="dark"
                                autoCorrect={false}
                                value={this.state.firstname}
                                required={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        firstname: text
                                    })
                                }}

                    />
                    <InputBlock name="Фамилия"
                                keyboardAppearance="dark"
                                autoCorrect={false}
                                value={this.state.lastname}
                                onChangeText={(text) => {
                                    this.setState({
                                        lastname: text
                                    })
                                }}


                    />
                </View>


                <View style={{
                    borderTopWidth: 1,
                    borderColor: platform.brandDivider,
                    marginTop: 15,
                }}>
                    <View style={{
                        ...inputBlockStyles.inputBlock,
                        flex: 1,
                        flexDirection: 'column',
                        paddingTop: 16,


                    }}>
                        <TouchableWithoutFeedback onPress={() => {
                            this.refs.comment.focus();
                        }}>
                            <Text style={{...inputBlockStyles.inputLabel, flex: 0, width: '100%'}}>Комментарий к
                                заказу</Text>
                        </TouchableWithoutFeedback>


                        <TextInput ref='comment' style={
                            inputBlockStyles.inputV
                        }

                                   blurOnSubmit={true}
                                   multiline={true}
                                   keyboardAppearance="dark"
                                   underlineColorAndroid="transparent"
                                   onChangeText={(text) => {
                                       this.setState({
                                           comment: text
                                       })
                                   }}
                        />


                    </View>
                </View>

                <View style={styles.bottom}>
                    {this.amount.discount && <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Сумма заказа</Text>
                        <Text style={styles.priceText}>{this.amount.amount} ₽</Text>
                    </View>}
                    {this.amount.discount && <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Скидка</Text>
                        <Text
                            style={styles.priceText}>{this.amount.discountAmount}₽</Text>
                    </View>}
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Итого к оплате</Text>
                        <Text
                            style={styles.priceText}>{this.amount.total} ₽</Text>
                    </View>
                    {this.isNativePayAvailable() &&
                      <Button dark full rounded style={styles.submit} onPress={() => this.simpleAPTest()}
                            disabled={!(this.state.firstname && this.state.firstname.length > 0 )}>
                        <Text uppercase={false}>Оплатить с ApplePay {this.amount.total} ₽</Text>
                      </Button>}

                    <Button warning full rounded style={styles.submit} onPress={() => this._buy()}
                            disabled={!(this.state.firstname && this.state.firstname.length > 0 )}>
                        <Text uppercase={false}>Перейти к оплате {this.amount.total} ₽</Text>
                    </Button>
                    <Text style={styles.mark}>Вы
                        получите {TextHelper.getBonus(this.amount.total)} {TextHelper.getBonusText(TextHelper.getBonus(this.amount.total))}</Text>
                </View>

                <SorryModal isOpen={this.state.isOpenOver} onClose={() => {
                    this.setState({isOpenOver: false})
                }}/>
            </ScrollView>


        </ImageBackground>
    }

    simpleAPTest() {
        const METHOD_DATA = [{
          supportedMethods: ['apple-pay'],
          data: {
            merchantIdentifier: 'my.app.merchant.id',
            supportedNetworks: ['visa', 'mastercard'],
            countryCode: 'RU',
            currencyCode: 'RUB'
          }
        }];

        const DETAILS = {
          id: 'result.order_id',
          displayItems: [
              {
                label: 'abcabc',
                amount: { currency: 'RUB', value: 500}
              }
          ],
          total: {
            label: 'abcabc',
            amount: { currency: 'RUB', value: 500 }
          }
        };
        const pReq = new PaymentRequest(METHOD_DATA, DETAILS);
        pReq.show();
    }


    buyApplePay = () => {

        let dishes = this.dishes.map(dish => ({
            id: dish.id,
            quantity: dish.count
        }));

        let data = {
            type: this.type === 'lunch' ? 2 : 3,
            people_quantity: this.state.count,
            timestamp: this.state.date.unix(),
            comment: this.state.comment,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            send_cheque: this.state.send_cheque,
            food: dishes
        };

        const METHOD_DATA = [{
          supportedMethods: ['apple-pay'],
          data: {
            merchantIdentifier: this.restaurant.apple_merchant_id,
            supportedNetworks: ['visa', 'mastercard'],
            countryCode: 'RU',
            currencyCode: 'RUB'
          }
        }];

        const DETAILS = {
          id: "result.order_id",
          displayItems: [
              {
                label: this.typeLabel,
                amount: { currency: 'RUB', value: this.amount.total}
              }
          ],
          total: {
            label: this.restaurant.title_short,
            amount: { currency: 'RUB', value: this.amount.total }
          }
        };

      const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);

      paymentRequest.show().then(paymentResponse => {

        paymentResponse.complete('success');
    }).then();
    }

    _buyApplePay = () => {

            //let result = await this.props.buy(this.props.billing.restaurantId, data);

            const METHOD_DATA = [{
              supportedMethods: ['apple-pay'],
              data: {
                merchantIdentifier: this.restaurant.apple_merchant_id,
                supportedNetworks: ['visa', 'mastercard'],
                countryCode: 'RU',
                currencyCode: 'RUB'
              }
            }];

            const DETAILS = {
              id: "result.order_id",
              displayItems: [
                  {
                    label: this.typeLabel,
                    amount: { currency: 'RUB', value: this.amount.total}
                  }
              ],
              total: {
                label: this.restaurant.title_short,
                amount: { currency: 'RUB', value: this.amount.total }
              }
            };

            const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
            alert('before show');
            paymentRequest.show();
            alert('after show');
            /*
            paymentRequest.show()
            .then(paymentResponse => {
              alert('THE RESPONSE');
             // paymentResponse.complete('success');
         });*/

            /*
            paymentRequest.show().then(async (paymentResponse) => {
                const { transactionIdentifier, paymentData } = paymentResponse.details;

                let paymentResult = await buyApplePay(result.order_id, paymentData);

                if (paymentResult.success === true) {
                    //payment successfull
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

                } else {
                    const resetAction = NavigationActions.back();
                    this.props.navigation.dispatch(resetAction);
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
            }).catch(console.warn);;*/


    }

    async _buy() {
        let dishes = this.dishes.map(dish => ({
            id: dish.id,
            quantity: dish.count
        }));

        let data = {
            type: this.type === 'lunch' ? 2 : 3,
            people_quantity: this.state.count,
            timestamp: this.state.date.unix(),
            comment: this.state.comment,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            send_cheque: this.state.send_cheque,
            food: dishes
        };
        try {
            let result = await this.props.buy(this.props.billing.restaurantId, data);

            this.props.navigation.navigate({
                routeName: 'Pay',
                params: {order: result, type: this.type},
                key: "Pay"
            });
        }
        catch (ex) {

            if (ex && ex.body && ex.body.error === 'no free tables') {
                this.setState({
                    isOpenOver: true
                })
            }
            else {
                setTimeout(() => {
                    Alert.alert(
                        'Произошла ошибка',
                        'Повторите еще раз или обратитесь в поддержку',
                        [

                            {
                                text: 'Ок', onPress: () => {

                            }
                            }
                        ]
                    );
                }, 10)
            }
        }

    }

    _validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    showApplePay = () => {

      const METHOD_DATA = [{
        supportedMethods: ['apple-pay'],
        data: {
          merchantIdentifier: this.restaurant.apple_merchant_id,
          supportedNetworks: ['visa', 'mastercard'],
          countryCode: 'RU',
          currencyCode: 'RUB'
        }
      }];

      const DETAILS = {
        id: 'basic-example',
        displayItems: [
            {
              label: this.typeLabel,
              amount: { currency: 'RUB', value: this.amount.total}
            }
        ],
        total: {
          label: this.restaurant.title_short,
          amount: { currency: 'RUB', value: this.amount.total }
        }
      };

      const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
      paymentRequest.show();
    }

    isNativePayAvailable = () => {
        //return false
      const METHOD_DATA = [{
        supportedMethods: ['apple-pay'],
        data: {
          merchantIdentifier: 'merchant.com.your-app.namespace',
          supportedNetworks: ['visa', 'mastercard'],
          countryCode: 'RU',
          currencyCode: 'RUB'
        }
      }];
      const DETAILS = {
        id: 'basic-example',
        displayItems: [
        ],
        total: {
          label: 'Merchant Name',
          amount: { currency: 'USD', value: '1.00' }
        }
      };

      const payment = new PaymentRequest(METHOD_DATA, DETAILS);
      return payment.canMakePayments();
    }


    getAllDish(restaurantId) {
        return this.props.restaurants[restaurantId].menu.categories
            .reduce((a, b) => {
                let items = [];
                if (b.categories) {
                    items = b.categories.reduce((a, subCategory) => {
                        return a.concat(subCategory.items);
                    }, [])
                } else {
                    items = b.items;
                    if (b.is_business_lunch === 1) {
                        for (let dish of items) {
                            dish.lunch = true;
                        }
                    }


                }
                return a.concat(items);
            }, []);
    }
}

function bindAction(dispatch) {
    return {
        buy: (restaurantId, data) => {
            return dispatch(buy(restaurantId, data));
        },
        buyApplePay: (order_id, paymentData) => {
            return dispatch(buyApplePay(order_id, paymentData));
        },
        clearBasket: () => {
            dispatch(clearBasket());
        }
    };
}



const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    billing: state.billing,
    isBuyPending: state.restaurant.isBuyPending,
    user: state.user.userData
});
const OrderPageSwag = connect(mapStateToProps, bindAction)(OrderPage);
export default OrderPageSwag;

const styles = {
    container: {
        flex: 1,
    },

    header: {
        paddingHorizontal: 16,
        marginTop: 15,
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: platform.brandDivider
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
    applePayButton: {
      marginTop: 5,
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#000'
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
