import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Picker, Right, Text, View} from 'native-base';
import {Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, Animated} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import {Platform} from "react-native";


import {connect} from "react-redux";
import CategoryList from "../../Restaurant/Category/CategoryList";
import {signStackStyle} from "../../../routers/SignStack";
import {modalCardStyles} from "../../Profile/Profile/index";
import ChesterIcon from "../../Common/ChesterIcon/index";
import MyModal from "../../Common/MyModal/index";
//import {Constants} from "expo";
import moment from "moment";
import {clearBasket, deleteDish} from "../../../actions/billing";
import BasketList from "./BasketList";
import BasketHelpers from "../BasketHelpers";
import TextHelper from "../../../../utilities/TextHelper";


class BasketPage extends React.Component {


    disabledLunch = true;
    disabledOut = true;
    state = {
        type: 'out',
        isOpenClearBasket: false,
        isOpenLunchWarning: false,
        isOpenOut: false,
        isOpenExistLunchDishes: false
    };

    componentWillMount() {
        this.restaurant = this.props.restaurants[this.props.billing.restaurantId];
        if (this.restaurant) {
            let day = moment().locale('en').format('dddd').toLowerCase();
            let timesheet = this.restaurant.schedule_business_lunch[day];
            this.startLunch = moment().startOf('day').seconds(timesheet.start);
            this.endLunch = moment().startOf('day').seconds(timesheet.finish);
            this.disabledLunch = timesheet.on === 0;
            timesheet = this.restaurant.schedule_takeouts[day];
            this.startOut = moment().startOf('day').seconds(timesheet.start);
            this.endOut = moment().startOf('day').seconds(timesheet.finish);
            this.disabledOut = timesheet.on === 0;
        }

    }

    componentWillUnmount() {

    }

    render() {


        let result = [];

        if (this.props.billing.restaurantId) {
            let allDishes = this.getAllDish(this.props.billing.restaurantId);
            for (let dish of this.props.billing.dishes) {
                let storedDish = allDishes.find(d => d.id === dish.id);
                if (storedDish) {

                    let dishResult ={
                        ...dish,
                        ...storedDish
                    };


                    if (this.state.type === "out") {
                        dishResult.disabled = dishResult.lunch
                    }
                    else {
                        dishResult.disabled = false;
                    }
                    result.push(dishResult);
                }
            }
            if (this.props.user) {
                this.amount = BasketHelpers.calcAmount(result, this.state.type === "lunch", this.restaurant.discount_on_main_menu, this.props.user.discount);
            }
            else {
                this.amount = BasketHelpers.calcAmount(result, this.state.type === "lunch", this.restaurant.discount_on_main_menu, 0);
            }
            this.dishes = result;

        }


        return <ImageBackground source={require('../../../../assets/images/background/background.png')}
                                style={signStackStyle}>

            <ScrollView>

                {result.length > 0 && <View>
                    <View style={styles.pills}>

                        <TouchableOpacity style={[styles.pill, this.state.type === 'out' && styles.activePill]}
                                          onPress={() => {
                                              this.setState({type: 'out'})
                                          }}>
                            <Text style={styles.pillText}>
                                Заберу сам
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pill, this.state.type === 'lunch' && styles.activePill]}
                                          onPress={() => {
                                              this.requestLunch();
                                          }}>
                            <Text style={styles.pillText}>
                                Ланч в ресторане (-{this.restaurant.discount_on_main_menu}%)
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.header}>{this.restaurant.title_short}</Text>
                </View>}
                <View style={styles.categoryList}>
                    {result.length > 0 ?
                        <BasketList data={result}
                                    navigation={this.props.navigation}
                                    onDeleteDish={(dish) => {
                                        this._onDeleteDish(dish)
                                    }}
                        /> :
                        <View style={{alignItems: 'center', width: '100%', marginTop: 10}}>
                            <Text style={{
                                fontSize: 22,
                                lineHeight: 33,
                                textAlign: 'center'
                            }}>Ваша корзина пуста</Text>

                        </View>}

                </View>

                {(result.length > 0 && this.amount) &&
                <View>
                    <View style={styles.clear}>
                        <TouchableOpacity
                            disabled={!result.length > 0}
                            onPress={() => {
                                this.setState({isOpenClearBasket: true})
                            }}>
                            <Text style={styles.clearText}>Очистить корзину</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.bottom}>
                        <View style={styles.price}>
                            <Text
                                style={this.amount.discount ? styles.priceText : styles.priceTextDiscount}>{this.amount.amount}
                                ₽</Text>
                            {this.amount.discount &&
                            <Text style={styles.priceTextDiscount}>{this.amount.total} ₽</Text>}
                        </View>
                        <Button warning
                                full
                                rounded
                                style={styles.submit}
                                disabled={!result.length > 0}
                                onPress={() => {
                                    this._order();

                                }}>
                            <Text uppercase={false}>Оформить заказ</Text>
                        </Button>
                        <Text style={styles.mark}>Вы
                            получите {TextHelper.getBonus(this.amount.total)} {TextHelper.getBonusText(TextHelper.getBonus(this.amount.total))}</Text>

                    </View>
                </View>
                }


            </ScrollView>


            <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.state.isOpenClearBasket} ref="modal"
                     position={'bottom'}
                     onRequestClose={() => this.setState({isOpenClearBasket: false})}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>Очистка корзины</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>Вы действительно хотите удалить все товары
                                из корзины?</Text>
                        </View>
                        <ChesterIcon name="trash" size={56} color={"#fff"}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button bordered rounded light style={modalCardStyles.cancelButton} onPress={() => {
                            this.setState({isOpenClearBasket: false})
                        }
                        }>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>Отмена</Text>
                        </Button>
                        <Button danger
                                rounded
                                style={modalCardStyles.removeButton}
                                onPress={() => {
                                    this.clearBasket();
                                }
                                }>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>Удалить</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>

            <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.state.isOpenLunchWarning}
                     ref="modal"
                     position={'bottom'}
                     onRequestClose={() => this.setState({isOpenLunchWarning: false})}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>Ланч в ресторане</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>Извините, но ланч в ресторане
                                {
                                    !this.disabledLunch ? ` доступен только с ${this.startLunch.format('HH:mm')} до ${this.endLunch.format('HH:mm')}. Оформление заказа возможно с 10:00.` : " сегодня недоступен"
                                }</Text>
                        </View>
                        <ChesterIcon name="trash" size={56} color={"#fff"}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button bordered rounded light full style={modalCardStyles.cancelButton} onPress={() => {
                            this.setState({isOpenLunchWarning: false})
                        }
                        }>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>ОК</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>


            <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.state.isOpenOut}
                     ref="modal"
                     position={'bottom'}
                     onRequestClose={() => this.setState({isOpenOut: false})}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>Заказ на вынос</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>Извините, но заказ на вынос в ресторане
                                {
                                    !this.disabledOut ? ` доступен только с ${this.startOut.format('HH:mm')} до ${this.endOut.format('HH:mm')}. Оформление заказа возможно с 10:00.` : " сегодня недоступен"
                                }
                            </Text>
                        </View>
                        <ChesterIcon name="trash" size={56} color={"#fff"}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button bordered rounded light full style={modalCardStyles.cancelButton} onPress={() => {
                            this.setState({isOpenOut: false})
                        }
                        }>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>ОК</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>


            <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.state.isOpenExistLunchDishes}
                     ref="modal"
                     position={'bottom'}
                     onRequestClose={() => this.setState({isOpenOut: isOpenExistLunchDishes})}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>Заказ на вынос</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>В вашей корзине есть товары, которые
                                доступны только для ланча в ресторане. Эти товары не будут учтены в заказе.
                            </Text>
                        </View>
                        <ChesterIcon name="trash" size={56} color={"#fff"}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button bordered rounded light full style={modalCardStyles.cancelButton} onPress={() => {
                            this.setState({isOpenExistLunchDishes: false});

                            if (this.dishes.filter((dish) => !dish.lunch).length > 0) {

                                this.props.navigation.navigate({
                                    routeName: 'Order',
                                    params: {type: this.state.type, amount: this.amount},
                                    key: "Order"
                                });

                            }

                        }
                        }>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>ОК</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>

        </ImageBackground>
    }

    clearBasket() {
        this.props.clearBasket();
        this.setState({isOpenClearBasket: false})
    }

    requestLunch() {
        if (this.lunchAvailable()) {
            this.setState({type: 'lunch'})
        }
        else {
            this.setState({isOpenLunchWarning: true})
        }
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


    outAvailable() {
        return !this.disabledOut && moment().add(1, 'hours') < this.endOut.clone().add(-15, "minutes") && moment().hours() >= 10;
    }

    lunchAvailable() {
        return !this.disabledLunch && moment().add(1, 'hours') < this.endLunch.clone().add(-15, "minutes") && moment().hours() >= 10;
    }


    _order() {
        if (this.props.logged) {
            if (this.state.type === 'out') {
                if (this.outAvailable()) {

                    if (this.dishes && this.dishes.some((dish) => dish.lunch)) {
                        this.setState({
                            isOpenExistLunchDishes: true
                        })
                    }
                    else {
                        this.props.navigation.navigate({
                            routeName: 'Order',
                            params: {type: this.state.type, amount: this.amount},
                            key: "Order"
                        });
                    }


                }
                else {
                    this.setState({isOpenOut: true})
                }
            }
            else {
                if (this.lunchAvailable()) {
                    this.props.navigation.navigate({
                        routeName: 'Order',
                        params: {type: this.state.type, amount: this.amount},
                        key: "Order"
                    });
                } else {
                    this.setState({isOpenLunchWarning: true})
                }
            }


        }
        else {
            this.props.navigation.navigate({
                routeName: 'Login',
                params: {nested: true, back: null},
                key: "Login"
            });
        }
    }

    _onDeleteDish(dish) {
        this.props.deleteDish(dish)
    }


}

function bindAction(dispatch) {
    return {
        clearBasket: () => {
            dispatch(clearBasket());
        },
        deleteDish: (dish) => {
            dispatch(deleteDish(dish));
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    logged: state.user.logged,
    user: state.user.userData,
    billing: state.billing
});
const BasketPageSwag = connect(mapStateToProps, bindAction)(BasketPage);
export default BasketPageSwag;

const styles = {
    container: {
        flex: 1,
    },
    pills: {
        marginTop: 17,
        marginBottom: 10,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: platform.brandWarning,
        borderRadius: 4,
        flexDirection: 'row'
    },
    pill: {
        flex: 1,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activePill: {
        backgroundColor: platform.brandWarning
    },
    pillText: {
        lineHeight: 18,
        fontSize: 13,
        color: '#fff'
    },
    header: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 28,
        lineHeight: 40,
        marginBottom: 15,
        marginHorizontal: 16
    },
    categoryList: {
        minHeight: Dimensions.get('window').height -
        (Platform.OS === "ios" ? 64 : (56 + 30/*Constants.statusBarHeight*/)) - 45 - 49 - 130 - 46,
        borderTopWidth: 1,
        borderColor: platform.brandDivider
    },
    clear: {
        marginTop: 'auto',
        height: 34,
        width: '100%',
        borderColor: platform.brandDivider,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: '#2B3034',
        alignItems: 'center',
        justifyContent: 'center'
    },
    clearText: {
        lineHeight: 20,
        fontSize: 14,
        color: platform.brandWarning,
    },
    bottom: {

        backgroundColor: '#2B3034',
        width: '100%',
        alignItems: 'center'
    },
    price: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8
    },
    priceText: {
        textDecorationLine: 'line-through',
        fontSize: 28,
        lineHeight: 40,
        color: '#7A8187',
        marginRight: 10
    },
    priceTextDiscount: {
        fontSize: 28,
        lineHeight: 40,
        color: '#fff'
    },
    submit: {
        marginHorizontal: 16,
        justifyContent: 'center'
    },
    mark: {
        fontSize: 13,
        lineHeight: 18,
        color: '#fff',
        marginVertical: 8
    }

};