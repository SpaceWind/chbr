import React from 'react';
import {Button, Container, Form, Input, Item, Text, View} from 'native-base';
import {connect} from "react-redux";
import {dispatch} from "redux";
import {confirmCode, getUserData, sendCode, setSignState, signIn, updateUserData} from "../../../actions/user";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import {Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert} from "react-native";
import {signStackStyle} from "../../../routers/SignStack";
import platform from "../../../../native-base-theme/variables/platform";
import {reserve} from "../../../actions/restaurant";
import Api from "../../../actions/api/api";
import {NavigationActions} from "react-navigation";


class SignSecondStep extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            sec: 30
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
        let sec = 30;
        if (diff > 30) {
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
            sec: 30
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
                return;
            }
            Api.jwt(this.props.token);

            if (this.isConfirmBookTable) {
                await this.updateUserData(this.props.navigation.state.params.first_name, this.props.navigation.state.params.last_name);
                await this.confirmBookTable();
            }
            else {
                this.props.getUserData();
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
                    <Image source={require('../../../../assets/images/login&registration/login-bg.png')}
                           style={signStackStyle}>
                        <View style={styles.container}>


                            <Spinner visible={this.props.pending || this.state.loading} textStyle={{color: '#FFF'}}/>

                            <View style={styles.image}>
                            </View>

                            <View style={styles.message}>
                                <Text style={{...styles.messageText}}>Код подтверждения был отправлен на номер
                                    {' +' + this.props.navigation.state.params.number}!</Text>
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
                                        : <Text>Отправить код повторно 0:{this.state.sec}</Text>
                                }


                            </View>

                            <View style={styles.button}>

                                <View>
                                    <Button transparent warning onPress={() => {
                                        this.props.signInAfter()
                                    }}>
                                        <Text uppercase={false}>Вступить в клуб позже ></Text>
                                    </Button>
                                </View>

                            </View>

                        </View>
                    </Image>
                </Container>
            </TouchableWithoutFeedback>
        );
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
            setTimeout(() => {
                Alert.alert(
                    'Успешно.',
                    'Ваш запрос на бронирование отправлен.',
                    [

                        {
                            text: 'Ок', onPress: () => {
                            const resetAction = NavigationActions.reset({
                                index: 1,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'Restaurants',
                                    }),
                                    NavigationActions.init({
                                        routeName: 'Restaurant',
                                        params: {key: this.props.navigation.state.params.restaurantId},
                                    })

                                ]
                            });

                            this.props.navigation.dispatch(resetAction);
                        }
                        }
                    ]
                )
            }, 10);
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
                            this.props.navigation.navigate('Restaurant', {key: this.props.navigation.state.params.restaurantId})
                        }
                        }
                    ]
                )
            }, 10);
        }
    }
}


function

bindAction(dispatch) {
    return {
        signInAfter: () => dispatch(setSignState(false)),
        signIn: () => dispatch(signIn()),
        confirmCode: (text) => dispatch(confirmCode(text)),
        sendCode: (number) => dispatch(sendCode(number)),


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
        pending: state.user.confirmCodePending
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