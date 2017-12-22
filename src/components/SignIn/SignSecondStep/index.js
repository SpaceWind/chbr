import React from 'react';
import {Button, Container, Form, Input, Item, Text, View} from 'native-base';
import {connect} from "react-redux";
import {dispatch} from "redux";
import {
    attachDevice, confirmCode, getUserData, resetCode, sendCode, setSignState, signIn,
    updateUserData
} from "../../../actions/user";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import {Image, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert} from "react-native";
import {signStackStyle} from "../../../routers/SignStack";
import platform from "../../../../native-base-theme/variables/platform";
import {reserve} from "../../../actions/restaurant";
import Api from "../../../actions/api/api";
import {NavigationActions} from "react-navigation";
import {MaskService} from 'react-native-masked-text'

class SignSecondStep extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            sec: 60
        };
        this.isConfirmBookTable = this.props.navigation.state.params.confirmBookTable;

    }

    tick() {
        if (this.state.sec <= 0) {
            clearInterval(this.timerID);
            return;
        }
        this.setState((prevState, props) => ({
            sec: prevState.sec - 1
        }));

    }

    componentDidMount() {
        let current = moment();
        let sent = this.props.sent;
        let diff = current.diff(sent, 'seconds');
        let sec = 60;
        if (diff > 60) {
            sec = 0;
        }
        this.setState((prevState, props) => ({
            sec
        }));


        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    async sendCode() {
        let result = await this.props.sendCode(this.props.navigation.state.params.number);
        this.setState((prevState, props) => ({
            sec: 60
        }));
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    async changeCode(text) {
        if (text.length > 5) {
            //try {

            this.setState({loading: true});

            try {
                await  this.props.confirmCode(text)
            }
            catch
                (ex) {


                this.setState({loading: false});
                if (!ex || !ex.notShowAlert) {

                    setTimeout(() => {
                        Alert.alert(
                            'Ошибка',
                            'Неправильный код.',
                            [

                                {
                                    text: 'Ок', onPress: () => {


                                }
                                }
                            ]
                        )
                    }, 10);
                }
            }
            Api.jwt(this.props.token);

            try {
                this.props.attachDevice(this.props.uid);
            }
            catch (ex) {

            }

            if (this.isConfirmBookTable) {
                await this.updateUserData(this.props.navigation.state.params.first_name, this.props.navigation.state.params.last_name);
                await this.confirmBookTable();
            }
            else {
                await this.props.getUserData();
                this.setState({loading: false});
                this.props.signInAfter();
            }


            //}
            /*catch (ex) {
             this.setState((prevState, props) => ({
             sec: 0
             }));
             }*/

        }
    }

    render() {


        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Container style={styles.container}>
                    <ImageBackground source={require('../../../../assets/images/login&registration/login-bg.png')}
                                     style={signStackStyle}>
                        <View style={styles.container}>


                            <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>

                            <View style={styles.image}>
                            </View>

                            <View style={styles.message}>
                                <Text style={{...styles.messageText}}>Код подтверждения был отправлен на номер
                                </Text>
                                <Text
                                    style={{...styles.messageText}}> {' ' + this._getMaskedPhone('+' + this.props.navigation.state.params.number)}</Text>
                            </View>


                            <View style={styles.phoneBlock}>

                                <View>
                                    <Item underline style={styles.codeItem}>
                                        <Input placeholder='код' style={styles.codeInput}
                                               onChangeText={(text) => this.changeCode(text)}
                                               keyboardAppearance="dark"
                                               autoCorrect={false}
                                               keyboardType="phone-pad"
                                        />
                                    </Item>

                                </View>
                            </View>
                            <View style={styles.resendCode}>
                                {
                                    this.state.sec === 0
                                        ?
                                        <TouchableOpacity transparent warning onPress={() => {
                                            this.sendCode()
                                        }}>
                                            <Text style={styles.resendCodeButton}>Отправить код повторно ></Text>
                                        </TouchableOpacity>
                                        : <Text>Отправить код повторно
                                            0:{this.state.sec < 10 ? '0' + this.state.sec : this.state.sec}</Text>
                                }


                            </View>

                            {!this.isConfirmBookTable && <View style={styles.button}>

                                <View>
                                    <Button transparent warning onPress={() => {
                                        this.props.resetCode();
                                        this.props.signInAfter()
                                    }}>
                                        <Text uppercase={false}>Вступить в клуб позже ></Text>
                                    </Button>
                                </View>

                            </View>}

                        </View>
                    </ImageBackground>
                </Container>
            </TouchableWithoutFeedback>
        );
    }

    _getMaskedPhone(phone) {
        return MaskService.toMask('custom', phone, {
            mask: "+7 999 999 99 99"
        });
    }

    async updateUserData(first_name, last_name) {
        let result = await this.props.getUserData();
        result.first_name = first_name;
        result.last_name = last_name;
        await this.props.updateUserData(result);
    }


    async confirmBookTable() {


        try {


            let result = await  this.props.bookTable(
                this.props.navigation.state.params.restaurantId,
                this.props.navigation.state.params.data
            );
            this.setState({loading: false});
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
    }

    goToHistory(reserveId) {
        const resetAction = NavigationActions.reset({
            index: 2,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Restaurants',
                    params: {key: this.params.restaurantId},
                }),
                NavigationActions.navigate({
                    routeName: 'OneRestaurant',
                    params: {key: this.params.restaurantId},
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
                }),
                NavigationActions.navigate({
                    routeName: 'OneRestaurant',
                    params: {key: this.props.navigation.state.params.restaurantId},
                })

            ]
        });

        this.props.navigation.dispatch(resetAction);
    }
}


function

bindAction(dispatch) {
    return {
        signInAfter: () => dispatch(setSignState(false)),
        signIn: () => dispatch(signIn()),
        confirmCode: (text) => dispatch(confirmCode(text)),
        sendCode: (number) => dispatch(sendCode(number)),
        attachDevice: (uid) => {
            return dispatch(attachDevice(uid));
        },
        resetCode: () => dispatch(resetCode()),
        getUserData: (text) => dispatch(getUserData()),
        updateUserData: (data) => dispatch(updateUserData(data)),
        bookTable: (restaurantId, data) => dispatch(reserve(restaurantId, data))
    };
}

const
    mapStateToProps = state => ({
        logged: state.user.logged,
        sent: state.user.sent,
        token: state.user.token,
        pending: state.user.confirmCodePending,
        uid: state.user.uid
    });
const
    styles = {
        container: {
            flex: 1,
            backgroundColor: 'transparent',

        },
        image: {
            height: 150,
            paddingTop: 40,

        },
        message: {
            paddingTop: 60,
            alignItems: 'center',
        },
        messageText: {
            width: 250,
            textAlign: 'center',
            fontSize: 20,
            lineHeight: 29
        },
        phoneBlock: {
            borderColor: '#d6d6d6',
            borderBottomWidth: 1,
        },
        code: {},
        codeInput: {
            textAlign: 'center',
            paddingLeft: 0,
            fontFamily: platform.fontFamily
        },
        codeItem: {
            borderColor: 'transparent',
        },
        resendCode: {
            alignItems: 'center',
            paddingTop: 20,
        },
        resendCodeButton: {
            fontSize: 16,
            color: platform.brandWarning
        },
        button: {
            paddingTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 15,
            paddingLeft: 15
        },


    };

const
    SignSecondStepSwag = connect(mapStateToProps, bindAction)(SignSecondStep);
export default SignSecondStepSwag;