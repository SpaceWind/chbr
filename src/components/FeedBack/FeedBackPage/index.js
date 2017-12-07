import React from 'react';
import {Button, Icon, List, ListItem, Switch, Text, View} from 'native-base';
import {
    Image, ImageBackground, TouchableOpacity, ScrollView, Alert, TextInput, LayoutAnimation,
    TouchableWithoutFeedback
} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import InputBlock, {InputBlockStyles} from "../../Common/Form/InputBlock/index";
import {TextInputMask} from "react-native-masked-text";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {Platform} from "react-native";
import * as _ from "lodash";
import {getUserData, sendTicket} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";


const currentPlatform = Platform.OS;

class FeedBackPageC extends React.Component {

    state = {
        userData: {
            first_name: '',
            last_name: '',
            email: ''
        },
        phone: '+7',
        anonymous: false
    };


    componentWillMount() {
        this.props.getUserData();
    }


    componentWillUnmount() {

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

    changeNumber(phone) {
        this.setState({
            phone: phone
        });
    }


    render() {

        return <ImageBackground source={require('../../../../assets/images/background/background.png')}
                                style={signStackStyle}>
            <KeyboardAwareScrollView
                resetScrollToCoords={{x: 0, y: 0}}
                contentContainerStyle={styles.container}
                enableAutoAutomaticScroll={!this.state.anonymous}
            >
                <ScrollView>


                    <Spinner visible={this.props.sendTicketPending}
                             textStyle={{color: '#FFF'}}/>

                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }
                    }>
                        <View style={InputBlockStyles.inputBlock}>
                            <Text style={InputBlockStyles.inputLabel}>Отправить анонимно</Text>

                            <View style={{paddingVertical: 16}}>
                                <Switch value={this.state.anonymous === 1} onValueChange={(push) => {

                                    if (push) {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    }

                                    this.setState({
                                        anonymous: push ? 1 : 0
                                    });
                                }}
                                        onTintColor={platform.brandWarning} {...(currentPlatform !== 'ios' ? {thumbTintColor: '#f4f5f5'} : {})}/>
                            </View>

                        </View>

                    </View>

                    {!this.state.anonymous && <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }
                    }>

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
                        <View style={InputBlockStyles.inputBlock}>
                            <TouchableWithoutFeedback onPress={() => {
                                this.refs.phone.getElement().focus();
                            }}>
                                <Text style={InputBlockStyles.inputLabel}>Телефон</Text>
                            </TouchableWithoutFeedback>
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

                        <InputBlock name="Email"
                                    keyboardType="email-address"
                                    keyboardAppearance="dark"
                                    autoCorrect={false}
                                    value={this.state.userData.email}
                                    onChangeText={(text) => {
                                        this.setState({
                                            userData: {
                                                ...this.state.userData,
                                                email: text
                                            }
                                        })
                                    }}
                                    onFocus={() => {
                                        this.backupEmail = this.state.userData.email;
                                    }}
                                    onBlur={() => {
                                        if (!this.validateEmail(this.email)) {
                                            this.setState({
                                                userData: {
                                                    ...this.state.userData,
                                                    email: this.backupEmail
                                                }
                                            })
                                        }
                                    }}

                        />


                    </View>}

                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }}>

                        <View style={{
                            ...InputBlockStyles.inputBlockV
                        }}>
                            <Text style={InputBlockStyles.inputLabelV}>Отзыв или предложение</Text>
                            <View style={{
                                height: this.state.anonymous ? 389 : 145,
                                paddingBottom: 15
                            }}>
                                <TextInput style={{
                                    ...InputBlockStyles.inputV,
                                    minHeight: 80
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
                        <Button warning rounded disabled={!(this.state.text && this.state.text.length > 0)}
                                style={{width: '100%'}} onPress={() => {
                            this.sendTicket(this.state);
                        }}>
                            <Text style={{textAlign: 'center', flex: 1}} uppercase={false}>Отправить</Text>
                        </Button>
                    </View>


                </ScrollView>
            </KeyboardAwareScrollView>


        </ImageBackground>
    }


    async sendTicket(ticket) {

        try {
            let result = await this.props.sendTicket(
                this.state);
            setTimeout(() => {
                Alert.alert(
                    'Успешно.',
                    'Ваш отзыв отправлен.',
                    [

                        {
                            text: 'Ок', onPress: () => {
                            this.props.navigation.navigate('Restaurant')
                        }
                        }
                    ]
                )
            }, 100);
        }
        catch (ex) {
            setTimeout(() => {
                Alert.alert(
                    'Ошибка отправки',
                    'Попробуйте отправить позже.',
                    [

                        {
                            text: 'Ок', onPress: () => {

                        }
                        }
                    ]
                )
            }, 100);
        }


    }


    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

}


function bindAction(dispatch) {
    return {
        getUserData: () => dispatch(getUserData()),
        sendTicket: (data) => dispatch(sendTicket(data)),
    };
}

const mapStateToProps = state => ({
    phone: state.user.phone,
    user: state.user.userData,
    sendTicketPending: state.user.sendTicketPending
});
const FeedBackPage = connect(mapStateToProps, bindAction)(FeedBackPageC);
export default FeedBackPage;

const styles = {
    container: {
        flex: 1,
    },
    buttonBlock: {
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingBottom: 30,
        paddingTop: 15,
        width: '100%',
        marginTop: 'auto'
    }
};