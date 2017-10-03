import React from 'react';
import {Button, Icon, Text, View} from 'native-base';
import {Image, TouchableOpacity, ScrollView, TextInput} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import {Platform} from "react-native";
import {connect} from "react-redux";

import {signStackStyle} from "../../../routers/SignStack";
import {InputBlockStyles as inputBlockStyles} from "../../Common/Form/InputBlock/index";
import SelectDate from "../../Restaurant/BookTable/SelectDate";
import InputBlock from "../../Common/Form/InputBlock/index";
import moment from "moment";
import ChesterIcon from "../../Common/ChesterIcon/index";


class OrderPage extends React.Component {


    state = {
        count: 2,
        countDevice: 2
    };

    constructor() {
        super();
        let currentHour = parseInt(moment().format('H'));
        let currentMinute = parseInt(moment().format('m'));
        if (currentHour < 10) {
            this.state.date = moment().floor(24, 'hours').add(10, 'hours');
        }
        else if (currentHour < 23 || (currentHour === 23 && currentMinute <= 30)) {

            if (currentHour + 2 < 23) {
                this.state.date = moment().add(2, 'hours').ceil(30, 'minutes');
            }
            else {
                this.state.date = moment().ceil(30, 'minutes');
            }
        }
        else {
            this.state.date = moment().ceil(24, 'hours').add(10, 'hours');
        }


        this.state.count = 2;
    }

    componentWillMount() {

    }

    componentWillUnmount() {

    }

    addItem(item) {
        this.setState((prevState) => {
            return {countDevice: prevState.countDevice + 1};
        });


    }

    minusItem(item) {
        if(this.state.countDevice>1)
        {
            this.setState((prevState) => {
                return {countDevice: prevState.countDevice - 1};
            });
        }

    }

    renderCard() {

        let source;
        switch ('visa') {
            case 'visa': {
                source = require(`../../../../assets/images/payment/visa.png`);
                break;
            }
            case 'mastercard': {
                source = require(`../../../../assets/images/payment/mastercard.png`);
                break;
            }
            case 'apple': {
                source = require(`../../../../assets/images/payment/apple.png`);
                break;
            }
        }


        return (
            <View style={styles.card}>
                <View style={styles.cardImage}>
                    <Image source={source}/>
                </View>

                <Text style={styles.cardText}>

                    1212 ****
                </Text>
                <TouchableOpacity style={styles.cardTextMain} onPress={() => {

                }
                }>
                    <Text style={styles.cardButtonText}>Изменить</Text>
                </TouchableOpacity>
            </View>
        )
    }


    render() {

        let type = this.props.navigation.state.params.type;


        return <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

            <ScrollView>

                <View style={styles.header}>
                    <Text style={styles.headerOrderNumber}>Заказ №24312 от 1 июня 12:35</Text>
                    <Text style={styles.headerText}>Ланч в ресторане</Text>
                    <Text style={styles.headerRestaurant}>Рестобар Chester</Text>
                </View>

                {
                    type === 'lunch' && <View style={styles.peopleCount}>
                        <Text style={styles.peopleCountText}>Выберите время и количество человек</Text>
                        <SelectDate
                            date={this.state.date}
                            count={this.state.count}
                            onDateSelected={(selected) => {
                                this.setState({date: selected.date, count: selected.count});
                            }}/>
                    </View>
                }


                <View style={{
                    borderTopWidth: 1,
                    borderColor: platform.brandDivider,
                    marginTop: 15
                }
                }>

                    <InputBlock name="Имя" keyboardType="email-address"/>
                    <InputBlock name="Фамилия"/>
                </View>

                {
                    type === 'out' &&
                    <View style={styles.deviceCount}>
                        <Text style={styles.deviceCountText}>Количество приборов</Text>
                        <View style={styles.changeCountItemButton}>
                            <Button dark bordered warning rounded style={styles.minusItemButton} onPress={() => {
                                this.minusItem()
                            }}>
                                <Icon name="remove" size={24}/>
                            </Button>

                            <View style={styles.counterItemButton}>
                                <Text style={styles.counterItemButtonText}> {this.state.countDevice}</Text>
                            </View>

                            <View style={styles.plusItemButton}>
                                <Button androidRippleColor="rgba(0, 0, 0, 0.15)" bordered warning rounded
                                        style={styles.plusItemButton} onPress={() => {
                                    this.addItem()
                                }}>
                                    <ChesterIcon name="plus-24" color={platform.brandWarning} size={16}/>
                                </Button>
                            </View>


                        </View>
                    </View>
                }


                <View style={{
                    borderTopWidth: 1,
                    borderColor: platform.brandDivider,
                    marginTop: 15,
                }}>
                    <View style={{
                        ...inputBlockStyles.inputBlock,
                        flex: 1,
                        flexDirection: 'column',
                        padding: 16
                    }}>

                        <Text style={{...inputBlockStyles.inputLabel, flex: 0, width: '100%'}}>Комментарий к
                            заказу</Text>

                        <TextInput style={{flex: 1}} multiline={true} underlineColorAndroid="transparent"/>
                    </View>
                </View>

                <View style={styles.payment}>
                    <Text style={styles.paymentText}>Метод оплаты</Text>
                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider
                    }}>
                        <View style={inputBlockStyles.inputBlock}>

                            {this.renderCard()}
                        </View>
                    </View>

                </View>

                <View style={styles.bottom}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Сумма заказа</Text>
                        <Text style={styles.priceText}>1000 ₽</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Скидка</Text>
                        <Text style={styles.priceText}>1000 ₽</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Сумма заказа</Text>
                        <Text style={styles.priceText}>1000 ₽</Text>
                    </View>
                    <Button warning full rounded style={styles.submit}>
                        <Text uppercase={false}>Оформить заказ</Text>
                    </Button>
                    <Text style={styles.mark}>Вы получите 12 баллов</Text>
                </View>

            </ScrollView>


        </Image>
    }
}

function bindAction(dispatch) {
    return {};
}
const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants
});
const OrderPageSwag = connect(mapStateToProps, bindAction)(OrderPage);
export default OrderPageSwag;

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
        marginTop:15,
        marginHorizontal:16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
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