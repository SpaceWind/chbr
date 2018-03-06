import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {
    Image, ImageBackground, ScrollView, TextInput, TouchableOpacity, Dimensions, Alert,
    TouchableWithoutFeedback
} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";
import RestaurantLocation from "../common/RestaurantLocation/index";
import RestaurantContact from "../common/RestaurantContact/index";
import {TextInputMask} from "react-native-masked-text";
import {connect} from "react-redux";
import {InputBlockStyles} from "../../Common/Form/InputBlock/index";
import InputBlock from "../../Common/Form/InputBlock/index";
import {getUserData, sendCode, updateUserData} from "../../../actions/user";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {reserve} from "../../../actions/restaurant";
import {NavigationActions} from "react-navigation";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import Constants from "../../../../utilities/Constants";
import PhoneInput from "../../Common/PhoneInput/index";


class BookTableConfirmC extends React.Component {

    state = {
        loading: false,
        userData: {
            first_name: '',
            last_name: '',
            email: ''
        },
        phone: '+7',
        isPhoneValid: false,
        anonymous: false
    };


    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }


    componentWillMount() {
        if (this.props.logged) {
            this.props.getUserData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({
                userData: nextProps.user
            });
        }
        if (nextProps.phone) {
            this.setState({
                phone: nextProps.phone,
                isPhoneValid: true
            });
        }

    }

    render() {


        return (


            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                >
                    <Container>
                        <Content>

                            <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>

                            <View style={styles.scrollBody}>

                                <View style={{paddingHorizontal: 16}}>
                                    <Text style={styles.header}>

                                        Заказ стола
                                    </Text>
                                    <Text style={styles.text}>
                                        {this.params.restaurant.title_full}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        {this.getCurrentInfo()}
                                    </Text>
                                </View>


                                <View style={{
                                    borderTopWidth: 1,
                                    borderColor: platform.brandDivider
                                }
                                }>
                                    <View style={InputBlockStyles.inputBlock}>
                                        <TouchableWithoutFeedback onPress={() => {

                                            this.refs.phone.focus();

                                        }}><View style={InputBlockStyles.requiredLabelBlock}>
                                            <Text
                                                style={InputBlockStyles.requiredInputLabel}>Телефон
                                            </Text>
                                            <Text style={InputBlockStyles.requiredLabel}>*</Text>

                                        </View></TouchableWithoutFeedback>


                                        <PhoneInput
                                            style={InputBlockStyles.input}
                                            ref={'phone'}
                                            value={this.state.phone}
                                            onChangeText={(text, isValid) => {
                                                this.changeNumber(text, isValid)
                                            }}
                                        />

                                    </View>

                                    <InputBlock name="Имя"
                                                keyboardAppearance="dark"
                                                autoCorrect={false}
                                                required={true}
                                                value={this.state.userData.first_name}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        userData: {
                                                            ...this.state.userData,
                                                            first_name: text
                                                        }
                                                    })
                                                }}
                                                onBlur={() => {

                                                }}

                                    />
                                    <InputBlock name="Фамилия"
                                                keyboardAppearance="dark"
                                                autoCorrect={false}
                                                value={this.state.userData.last_name}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        userData: {
                                                            ...this.state.userData,
                                                            last_name: text
                                                        }
                                                    })
                                                }}
                                                onBlur={() => {

                                                }}


                                    />


                                </View>

                                <View style={{
                                    borderTopWidth: 1,
                                    borderColor: platform.brandDivider,
                                    marginTop: 15
                                }}>
                                    <TouchableWithoutFeedback onPress={() => {
                                        this.refs.comment.focus();
                                    }}>
                                        <View style={{
                                            ...InputBlockStyles.inputBlockV,
                                            flex: 1
                                        }}>

                                            <Text style={InputBlockStyles.inputLabelV}>Комментарий к заказу</Text>

                                            <View>
                                                <TextInput ref='comment' style={{
                                                    ...InputBlockStyles.inputV,
                                                    flex: 1
                                                }}

                                                           blurOnSubmit={true}
                                                           multiline={true}
                                                           keyboardAppearance="dark"
                                                           underlineColorAndroid="transparent"
                                                           onChangeText={(text) => {
                                                               this.setState({
                                                                   text
                                                               })
                                                           }}
                                                />
                                            </View>


                                        </View>
                                    </TouchableWithoutFeedback>

                                </View>


                                <View style={styles.buttonBlock}>
                                    <Button warning
                                            rounded
                                            style={{width: '100%'}}
                                            disabled={

                                                !(this.state.isPhoneValid &&
                                                    (this.state.userData.first_name && this.state.userData.first_name.length > 0))
                                            }
                                            onPress={
                                                this.boorConfirmRequest.bind(this)
                                            }

                                    >
                                        <Text style={{textAlign: 'center', flex: 1}} uppercase={false}>Забронировать
                                            стол</Text>
                                    </Button>
                                </View>


                            </View>
                        </Content>
                    </Container>
                </KeyboardAwareScrollView>
            </ImageBackground>
        );
    }

    changeNumber(phone, isValid) {
        this.setState({
            phone: phone,
            isPhoneValid: isValid
        });
    }

    getCurrentInfo() {
        let result = this.params.people_quantity + ' ' + (this.params.people_quantity === 1 || this.props.people_quantity >= 5 ? 'человек' : 'человека');
        let date = moment.unix(this.params.time.timestamp);
        if (date.day() === moment().day()) {
            result += ', сегодня, ' + date.format('HH:mm');
        }
        else {
            result += ', ' + date.format('ddd D MMMM, HH:mm');
        }
        return result
    }


    boorConfirmRequest() {


        if (!this.props.logged ||
            (!this.props.user.first_name || this.props.user.first_name.length ===0) ||
            (!this.props.user.last_name || this.props.user.last_name.length ===0) &&  this.state.userData.last_name !== this.props.user.last_name) {
            Alert.alert(
                'Сохранение данных',
                'Сохранить данные в вашем профиле для последующих бронирований?',
                [
                    {
                        text: 'Нет', onPress: () => {
                        this.bookConfirm(false)

                    }, style: 'cancel'
                    },
                    {
                        text: 'Ок', onPress: () => {

                        this.bookConfirm(true)

                    }
                    }
                ]
            )
        }
        else {
            this.bookConfirm(false)
        }

    }

    async bookConfirm(save) {

        let data = {
            people_quantity: this.props.navigation.state.params.people_quantity,
            timestamp: this.props.navigation.state.params.time.timestamp,
            comment: this.state.text,
            client_name: this.state.userData.first_name + " " + this.state.userData.last_name,
            client_phone: this.state.phone
        };
        let restaurantId = this.props.navigation.state.params.restaurant.id;

        if (this.props.logged) {
            this.setState({loading: true});
            try {


                const result = await  this.props.bookTable(
                    restaurantId,
                    data
                );

                if (save) {
                    await this.props.updateUserData(this.state.userData);
                }


                setTimeout(() => {
                    Alert.alert(
                        'Успешно.',
                        'Ваш запрос на бронирование отправлен.',
                        [

                            {
                                text: 'Ок', onPress: () => {

                            }
                            }
                        ]
                    );

                    this.goToHistory(result.reserve_id)

                }, 10);
            }
            catch
                (ex) {

                let text = 'Попробуйте забронировать позже.';
                if (ex && ex.body && ex.body.error === 'user has unconfirmed reserves') {
                    text = "Вы уже оставляли заявку на бронь"
                }


                setTimeout(() => {
                    Alert.alert(
                        'Бронирование невозможно',
                        text,
                        [

                            {
                                text: 'Ок', onPress: () => {

                            }
                            }
                        ]
                    );
                    this.backToRestaurant();
                }, 100);
            }
            this.setState({loading: false});


        }
        else {

            let result = await this.props.sendCode(this.state.phone);
            this.props.navigation.navigate('BookTableConfirmCode', {
                restaurantId: restaurantId,
                data: data,
                confirmBookTable: true,
                save: save,
                number: this.state.phone,
                first_name: this.state.userData.first_name,
                last_name: this.state.userData.last_name
            })
        }

    }


    goToHistory(reserveId) {
        const resetAction = NavigationActions.reset({
            index: 2,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Restaurants',
                    params: {key: this.params.restaurant.id},
                }),
                NavigationActions.navigate({
                    routeName: 'OneRestaurant',
                    params: {key: this.params.restaurant.id},
                }),
                NavigationActions.navigate({
                    routeName: 'RestaurantBookTableHistory',
                    params: {reserveId: reserveId},
                }),
            ]
        });
        this.props.navigation.dispatch(resetAction)
    }


    backToRestaurant() {
        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Restaurants',
                    params: {key: this.params.restaurant.id},
                }),
                NavigationActions.navigate({
                    routeName: 'OneRestaurant',
                    params: {key: this.params.restaurant.id},
                }),
            ]
        });
        this.props.navigation.dispatch(resetAction)
    }
}


function

bindAction(dispatch) {
    return {
        sendCode: (number) => dispatch(sendCode(number)),
        bookTable: (restaurantId, data) => dispatch(reserve(restaurantId, data)),
        getUserData: () => dispatch(getUserData()),
        updateUserData: (data) => dispatch(updateUserData(data)),

    };
}

const
    mapStateToProps = state => ({
        phone: state.user.phone,
        logged: state.user.logged,
        user: state.user.userData,
    });
const
    BookTableConfirm = connect(mapStateToProps, bindAction)(BookTableConfirmC);
export default BookTableConfirm;

const
    styles = {


        container: {
            flex: 1,

        },
        scrollBody: {
            minHeight: Constants.BODY_HEIGHT
        },
        header: {
            color: platform.brandWarningAccent,
            fontFamily: platform.fontFamily,
            fontSize: 28,
            lineHeight: 40,
            marginBottom: 0,
            marginTop: 15,
        },
        text: {
            fontFamily: platform.fontFamily,
            fontSize: 20,
            lineHeight: 29
        },
        dateText: {
            fontFamily: platform.fontFamily,
            fontSize: 22,
            lineHeight: 31,
            marginTop: 13,
            marginBottom: 15
        },
        inputBlock: {
            backgroundColor: '#2B3034',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderColor: platform.brandDivider
        },
        inputLabel: {
            color: '#B3BBC1',
            fontFamily: platform.fontFamily,
            fontSize: 18,
            lineHeight: 20,
            flex: 1
        },
        input: {
            flex: 3,
            fontFamily: platform.fontFamily,
            fontSize: 20,
            height: 52,
            paddingVertical: 16,
            color: "#fff"
        },
        buttonBlock: {
            alignSelf: 'center',
            paddingHorizontal: 16,
            paddingTop: 30,
            paddingBottom: 30,
            width: '100%',
            marginTop: 'auto'
        }
    };