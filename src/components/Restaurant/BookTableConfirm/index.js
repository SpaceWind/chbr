import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, ScrollView, TextInput, TouchableOpacity, Dimensions, Alert} from "react-native";
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
        this.props.getUserData();
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


            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                >
                    <Container>
                        <Content>

                            <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>

                            <View style={{...styles.container}}>

                                <View style={{paddingHorizontal: 16}}>
                                    <Text style={styles.header}>

                                        Заказ стола
                                    </Text>
                                    <Text style={styles.text}>
                                        Рестобар Chester
                                    </Text>
                                    <Text style={styles.dateText}>
                                        {this.getCurrentInfo()}
                                    </Text>
                                </View>


                                {!this.props.logged && <View style={{
                                    borderTopWidth: 1,
                                    borderColor: platform.brandDivider
                                }
                                }>
                                    <View style={InputBlockStyles.inputBlock}>
                                        <Text style={InputBlockStyles.inputLabel}>Телефон</Text>

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
                                                this.changeNumber(text)
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


                                </View>}

                                <View style={{
                                    borderTopWidth: 1,
                                    borderColor: platform.brandDivider,
                                    marginTop: 15,
                                    minHeight: 185,
                                    maxHeight: 250
                                }}>

                                    <View style={{
                                        ...InputBlockStyles.inputBlockV,
                                        flex: 1
                                    }}>
                                        <Text style={InputBlockStyles.inputLabelV}>Комментарий к заказу</Text>
                                        <View style={{
                                            paddingBottom: 15,
                                            flex: 1
                                        }}>
                                            <TextInput style={{
                                                ...InputBlockStyles.inputV,
                                                minHeight: 80,
                                                flex: 1

                                            }}
                                                       multiline={true}
                                                       underlineColorAndroid="transparent"
                                                       onChangeText={(text) => {
                                                           this.setState({
                                                               text
                                                           })
                                                       }}
                                            />
                                        </View>


                                    </View>


                                </View>


                                <View style={styles.buttonBlock}>
                                    <Button warning
                                            rounded
                                            style={{width: '100%'}}
                                            disabled={!this.props.logged && !this.isValidNumber()}
                                            onPress={this.bookConfirm.bind(this)}

                                    >
                                        <Text style={{textAlign: 'center', flex: 1}} uppercase={false}>Забронировать стол</Text>
                                    </Button>
                                </View>


                            </View>
                        </Content>
                    </Container>
                </KeyboardAwareScrollView>
            </Image>
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
            comment: this.state.text || 'empty'
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
                    this.backToRestaurant();

                }, 1);
            }
            catch
                (ex) {
                setTimeout(() => {
                    Alert.alert(
                        'Ошибка',
                        'Попробуйте забронировать позже.',
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
                first_name: this.state.first_name,
                last_name: this.state.last_name

            })
        }

    }


    backToRestaurant() {

        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Restaurants',
                    params: {key: this.params.restaurant.id},
                }),
                NavigationActions.init({
                    routeName: 'Restaurant',
                    params: {key: this.params.restaurant.id},
                })

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