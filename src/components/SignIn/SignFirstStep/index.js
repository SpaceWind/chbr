import React from 'react';
import {Button, Container, Form, Input, Item, Label, Text, View} from 'native-base';
import {sendCode, setSignState} from "../../../actions/user";
import connect from "react-redux/es/connect/connect";
//import {Constants} from 'expo';
import {
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
    Platform,
    Linking
} from "react-native";
import {signStackStyle} from "../../../routers/SignStack";
import SignPhoneInput from "../SignPhoneInput/index";
import H3 from "../../../../native-base-theme/components/H3";
import platform from "../../../../native-base-theme/variables/platform";
import Spinner from "react-native-loading-spinner-overlay";
import {Keyboard, Alert} from 'react-native';

import Permissions from 'react-native-permissions';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import Constants from "../../../../utilities/Constants";
import {NavigationActions} from "react-navigation";

class SignFirstStep extends React.Component {


    state = {};

    constructor(props) {
        super(props);
        this.state = {
            number: null,
            valid: false,
            borderColor: platform.brandOutline
        };
    }


    changeNumber(number, isValid) {
        this.setState({
            number: number,
            valid: isValid,
            borderColor: isValid ? platform.brandWarning : platform.brandOutline
        });
        this.number = number;
    }

    async sendCode() {

        this.setState({loading: true});
        try {
            let result = await this.props.sendCode(this.number);

            console.log(result);

            this.props.navigation.navigate({
                routeName: 'SignSecond',
                params:{
                    number: this.number,
                    nested: this.props.navigation.state.params && this.props.navigation.state.params.nested,
                    back: this.props.navigation.state.params && this.props.navigation.state.params.back
                },
                key: "SignSecond"
            });

        }

        catch (ex) {

            if (!ex || !ex.notShowAlert) {

                setTimeout(() => {
                    Alert.alert(
                        'Ошибка подключения к серверу',
                        '',
                        [
                            {
                                text: 'Ок'
                                , onPress: () => {

                            }
                            }
                        ]
                    )
                }, 100);
            }

        }
        this.setState({loading: false});
    }

    componentWillMount() {


        if (Platform.OS === 'ios') {
            Permissions.request('notification');
        }


        if (this.props.navigation.state.params && this.props.navigation.state.params.nested) {
            this.nested = this.props.navigation.state.params.nested;
        }
        else {
            if (this.props.sent && moment().diff(this.props.sent, 'seconds') < 60 && this.props.token) {
                this.props.navigation.navigate('SignSecond', {number: this.props.phone});
            }
        }


    }


    render() {

        let height = Dimensions.get('window').height
            - (Platform.OS !== 'ios' ? Constants.STATUSBAR_HEIGHT : 0)
            - (this.nested ? Constants.NAVBARHEIGHT : 0);
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                <ImageBackground source={require('../../../../assets/images/login&registration/login-bg.png')}
                                 style={signStackStyle}>

                    <KeyboardAwareScrollView
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="always"
                    >
                        <ScrollView ref='scroll' keyboardShouldPersistTaps="always">

                            <View style={{...styles.container, height: height}}>
                                <Spinner visible={this.state.loading}
                                         textStyle={{color: '#FFF'}}/>


                                <View style={styles.centerBlock}>
                                    <View style={styles.image}>
                                        <Image
                                            source={require('../../../../assets/images/login&registration/login-logo.png')}
                                        />
                                    </View>

                                    <View style={styles.message}>
                                        <Text style={styles.messageText}>Введите свой номер телефона, чтобы
                                            вступить в
                                            программу
                                            лояльности и получать скидки!
                                        </Text>
                                    </View>


                                    <View style={{...styles.phoneBlock, borderColor: this.state.borderColor}}>


                                        <View style={styles.phone}>
                                            <SignPhoneInput ref="phone"
                                                            onChangePhoneNumber={(number, isValid) => this.changeNumber(number, isValid)}/>
                                        </View>
                                    </View>

                                    <View style={styles.button}>


                                        <Button block rounded warning disabled={!this.state.valid} onPress={() => {
                                            this.sendCode()
                                        }}>
                                            <Text uppercase={false}>Далее ></Text>
                                        </Button>


                                        <View>
                                            <Button transparent warning onPress={() => {

                                                if (this.props.navigation.state.params && this.props.navigation.state.params.nested) {

                                                    this._end();
                                                }
                                                else {
                                                    this.props.signInAfter()
                                                }


                                            }}>
                                                <Text style={{lineHeight: 29, fontSize: 20}} uppercase={false}>Вступить
                                                    в
                                                    клуб
                                                    позже ></Text>
                                            </Button>
                                        </View>

                                    </View>
                                </View>


                                <View style={styles.politicsBlock}>
                                    <View style={styles.politics}>
                                        <Text style={styles.politicsText}>Регистрируясь, вы подтверждаете, что прочитали
                                            и согласились с<Text> </Text>
                                            <Text
                                                style={styles.politicsLink}
                                                onPress={() => {
                                                    Linking.openURL('https://docs.google.com/document/d/12AACat3xcGIGBB_FZiKCr3Cwi1Xu7CZJuvcO5opB3j8')
                                                }}

                                            >политикой
                                                конфиденциальности</Text></Text>
                                    </View>

                                </View>
                            </View>

                        </ScrollView>
                    </KeyboardAwareScrollView>

                </ImageBackground>

            </TouchableWithoutFeedback>

        );
    }


    _end() {

        if (this.props.navigation.state.params.back) {

        }
        else {
            const backAction = NavigationActions.back();
            this.props.navigation.dispatch(backAction);
        }
    }

}

function bindAction(dispatch) {
    return {
        signInAfter: () => dispatch(setSignState(false)),
        sendCode: (number) => dispatch(sendCode(number))
    };
}

const mapStateToProps = state => ({
    sendCodePending: state.user.sendCodePending,
    sent: state.user.sent,
    token: state.user.token,
    phone: state.user.phone
});


const styles = {
    container: {
        backgroundColor: 'transparent',

    },
    centerBlock: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: Dimensions.get('window').height > 660 ? Dimensions.get('window').height * 0.30 : Dimensions.get('window').height * 0.19
    },
    image: {
        height: 129,
        alignItems: 'center',
        marginTop: 44,
    },
    message: {
        paddingTop: 20,
        paddingBottom: 16,
        alignItems: 'center',
    },
    messageText: {
        width: 280,
        lineHeight: 29,
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    phoneBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#d6d6d6',
        paddingBottom: 6,
        borderBottomWidth: 1,
    },
    phone: {
        width: 185,
    },

    button: {
        paddingTop: 15,
        alignItems: 'center',

        paddingRight: 16,
        paddingLeft: 16
    },
    politicsBlock: {
        alignItems: 'center'
    },
    politics: {
        marginHorizontal: 'auto',
        marginBottom: 12,
        maxWidth: 330
    },
    politicsLink: {
        borderBottomWidth: 1,
        color: platform.brandFontAccent,
        borderBottomColor: platform.brandFontAccent,
        textDecorationLine: 'underline'
    },
    politicsText: {
        textAlign: 'center',
        color: platform.brandFontAccent,
    }

};


const SignFirstStepSwag = connect(mapStateToProps, bindAction)(SignFirstStep);
export default SignFirstStepSwag;