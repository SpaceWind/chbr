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
import {getUserData, sendCode} from "../../../actions/user";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {reserve} from "../../../actions/restaurant";
import {NavigationActions} from "react-navigation";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import Constants from "../../../../utilities/Constants";


class BookTableConfirmC extends React.Component {

    state = {
        loading: false,
        userData: {
            first_name: '',
            last_name: '',
            email: ''
        },
        phone: '+7',
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
                phone: nextProps.phone
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
                                            if (!this.props.logged) {
                                                this.refs.phone.getElement().focus();
                                            }
                                        }}><Text
                                            style={InputBlockStyles.inputLabel}>Телефон</Text></TouchableWithoutFeedback>


                                        <TextInputMask
                                            style={InputBlockStyles.input}
                                            keyboardType="phone-pad"
                                            type={'custom'}
                                            ref={'phone'}
                                            options={{mask: '+7 (999) 999-99-99'}}
                                            keyboardAppearance="dark"
                                            autoCorrect={false}
                                            value={this.state.phone}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(text) => {
                                                if (!this.props.logged) {
                                                    this.changeNumber(text)
                                                }
                                                else {
                                                    this.changeNumber(this.state.phone)
                                                }

                                            }}
                                        />
                                    </View>

                                    <InputBlock name="Имя"
                                                keyboardAppearance="dark"
                                                autoCorrect={false}
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
                                            disabled={!this.props.logged && !this.isValidNumber()}
                                            onPress={this.bookConfirm.bind(this)}

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

    changeNumber(phone) {
        this.setState({
            phone: phone
        });
    }

    isValidNumber() {
        return this.state.phone && this.state.phone.replace(/[^\d]/g, '').length === 11
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


    async bookConfirm(ticket) {

        let data = {
            people_quantity: this.props.navigation.state.params.people_quantity,
            timestamp: this.props.navigation.state.params.time.timestamp,
            comment: this.state.text
        };
        let restaurantId = this.props.navigation.state.params.restaurant.id;

        if (this.props.logged) {
            this.setState({loading: true});
            try {


                let result = await  this.props.bookTable(
                    restaurantId,
                    data
                );

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

            let phone = this.state.phone.substring(1).replace(/[^\d]/g, '');
            let result = await this.props.sendCode(phone);

            this.props.navigation.navigate('BookTableConfirmCode', {
                restaurantId: restaurantId,
                data: data,
                confirmBookTable: true,
                number: phone,
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