import React from 'react';
import {Button, Icon, Left, List, ListItem, Picker, Right, Switch, Text, View} from 'native-base';
import {Image, ImageBackground, TouchableOpacity, ScrollView, Alert} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

import UserInfo from "../../../routers/components/UserInfo/index";
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import InputBlock, {InputBlockStyles} from "../../Common/Form/InputBlock/index";
import {TextInputMask} from "react-native-masked-text";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Swipeout from "react-native-swipeout";
import ChesterIcon from "../../Common/ChesterIcon/index";
import MyModal from "../../Common/MyModal/index";
import {Platform} from "react-native";
import {getUserData, setSignState, signOut, updateUserData} from "../../../actions/user";
import * as _ from "lodash";


const currentPlatform = Platform.OS;

class Profile extends React.Component {

    state = {
        push: true,
        isRemoveOpen: false,
        removeCard: null,
        userData: {}
    };


    componentWillMount() {
        this.props.getUserData();
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            userData: nextProps.user
        });
    }

    changePhone() {
        Alert.alert(
            'Смена номера',
            'Изменение привяжет профиль вместе с платежной информацией, историей заказов и списком адресов к новому номеру телефона.',
            [
                {text: 'Отменить', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]
        )
    }

    render() {

        return <ImageBackground source={require('../../../../assets/images/background/background.png')}
                                style={signStackStyle}>
            <KeyboardAwareScrollView
                resetScrollToCoords={{x: 0, y: 0}}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <ScrollView>

                    <View>
                        <UserInfo navigation={this.props.navigation}/>
                    </View>
                    <View style={{
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
                                        this.props.updateUserData(_.pick(this.state.userData, ['first_name', 'last_name', 'notifications', 'email']));
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
                                        this.props.updateUserData(_.pick(this.state.userData, ['first_name', 'last_name', 'notifications', 'email']));
                                    }}


                        />
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

                                        if (!this.validateEmail(this.state.userData.email)) {
                                            this.setState({
                                                userData: {
                                                    ...this.state.userData,
                                                    email: this.backupEmail
                                                }
                                            })
                                        } else {
                                            this.props.updateUserData(_.pick(this.state.userData, ['first_name', 'last_name', 'notifications', 'email']));
                                        }


                                    }}

                        />
                    </View>

                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }}>
                        <View style={InputBlockStyles.inputBlock}>
                            <Text style={InputBlockStyles.inputLabel}>Телефон</Text>

                            <TextInputMask
                                style={InputBlockStyles.input}
                                keyboardType="phone-pad"
                                type={'custom'}
                                ref={'phone'}
                                options={{mask: '+7 (999) 999-99-99'}}
                                editable={false}
                                keyboardAppearance="dark"
                                autoCorrect={false}
                                value={this.props.phone}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    this.changeNumber(text)
                                }}
                            />
                            <TouchableOpacity style={{paddingVertical: 16}} onPress={() => {
                                this.changePhone();
                            }}>
                                <ChesterIcon name={'edit-16'} size={16} color={platform.brandWarning}/>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }
                    }>
                        <View style={InputBlockStyles.inputBlock}>
                            <Text style={InputBlockStyles.inputLabel}>Push-уведомления</Text>

                            <View style={{paddingVertical: 16}}>
                                <Switch value={this.state.userData.notifications === 1} onValueChange={(push) => {

                                    let userData = {
                                        userData: {
                                            ...this.state.userData,
                                            notifications: push ? 1 : 0
                                        }
                                    };

                                    this.setState(userData);
                                    this.props.updateUserData(_.pick(userData.userData, ['first_name', 'last_name', 'notifications', 'email']));
                                }}
                                        onTintColor={platform.brandWarning} {...(currentPlatform !== 'ios' ? {thumbTintColor: '#f4f5f5'} : {})}/>
                            </View>

                        </View>

                    </View>

                    {/*release <View>
                        <Text style={styles.cardsHeader}>Методы оплаты</Text>
                    </View>
                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }}>
                        {
                            this._renderList()
                        }
                    </View>*/}


                    <View style={{
                        borderTopWidth: 1,
                        borderColor: platform.brandDivider,
                        marginTop: 15
                    }
                    }>
                        <View style={InputBlockStyles.inputBlock}>
                            <Text style={InputBlockStyles.inputLabel}> Версия приложения</Text>

                            <View style={{paddingVertical: 16}}>
                                <Text style={{fontSize: 18}}>1.01</Text>
                            </View>

                        </View>

                    </View>


                    <View style={{
                        marginTop: 30,
                        marginBottom: 30,
                        paddingHorizontal: 16
                    }}>
                        <Button
                            danger
                            full
                            rounded
                            onPress={() => {


                                this.props.signIn();
                                this.props.logOut();
                            }}>
                            <Text>Выйти</Text>
                        </Button>
                    </View>


                </ScrollView>
            </KeyboardAwareScrollView>


            <MyModal style={{
                height: 215,
                backgroundColor: "#7A8187"
            }} isOpen={this.state.isRemoveOpen} ref="modal"
                     position={'bottom'}
                     onRequestClose={() => this.setState({isRemoveOpen: false})}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>Удаление карты</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>Вы действительно хотите удалить
                                карту?</Text>
                        </View>
                        <Image source={require(`../../../../assets/images/payment/credit-card.png`)}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button bordered rounded light style={modalCardStyles.cancelButton} onPress={() => {
                            this.setState({isRemoveOpen: false})
                        }
                        }>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>Отмена</Text>
                        </Button>
                        <Button danger rounded style={modalCardStyles.removeButton}>
                            <Text uppercase={false} style={modalCardStyles.buttonText}>Удалить</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>

        </ImageBackground>
    }


    _renderList() {

        return <View>
            {[
                {
                    type: 'visa',
                    text: 'MasterCard **** 4511',
                    main: true
                },
                {
                    type: 'mastercard',
                    text: 'VISA **** 2816',
                    main: false
                }
                ,
                {
                    type: 'apple',
                    text: 'Apple Pay',
                    main: false
                }
            ].map((card) => {
                let swipeoutBtns = [
                    {
                        onPress: () => {
                            this.setState({removeCard: card, isRemoveOpen: true})
                        },
                        component: (<Button danger style={styles.swipeButton}
                                            onPress={() => {
                                                this.setState({removeCard: card, isRemoveOpen: true})
                                            }}
                        >
                            <Text style={styles.swipeButtonText} uppercase={false}>Удалить</Text>
                        </Button>),
                        underlayColor: '#9b4f47'
                    }
                ];

                if (!card.main) {
                    swipeoutBtns.push(
                        {
                            width: 88,
                            component: <Button warning style={styles.swipeButton}><Text
                                style={styles.swipeButtonText}
                                numberOfLines={2}
                                uppercase={false}>Сделать
                                основной</Text></Button>,
                            underlayColor: 'transparent'
                        })
                }
                let source;
                switch (card.type) {
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


                return <View key={card.type}>
                    <Swipeout backgroundColor={'#2B3034'} right={swipeoutBtns} buttonWidth={88}
                              sensitivity={70}
                              autoClose={true} scroll={() => true}>
                        <View style={styles.cardListItem}>
                            <View style={styles.cardListItemImage}>
                                <Image source={source} style={{}}/>
                            </View>
                            <Text style={styles.cardListItemText}>
                                {card.text}
                            </Text>
                            {card.main &&
                            <Text style={styles.cardListItemTextMain}>
                                Основная
                            </Text>

                            }
                        </View>
                    </Swipeout>
                </View>
            })}

            <TouchableOpacity style={styles.cardListItem} onPress={() => {
                this.props.navigation.navigate('AddCard')
            }
            }>
                <View style={styles.cardListItemImage}>
                    <ChesterIcon name="plus-24" size={22} color={"#fff"}/>
                </View>

                <Text style={styles.cardListItemText}>Добавить метод оплаты</Text>
            </TouchableOpacity>


        </View>
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

}


function bindAction(dispatch) {
    return {
        logOut: () => dispatch(signOut()),
        getUserData: () => dispatch(getUserData()),
        updateUserData: (data) => dispatch(updateUserData(data)),
        signIn: () => dispatch(setSignState(true))
    };
}

const mapStateToProps = state => ({
    phone: state.user.phone,
    user: state.user.userData
});
const ProfileSwag = connect(mapStateToProps, bindAction)(Profile);
export default ProfileSwag;

const styles = {
    container: {
        flex: 1,
    },
    cardsHeader: {
        marginTop: 15,
        fontSize: 22,
        lineHeight: 31,
        paddingHorizontal: 16
    },
    cardList: {
        marginTop: 15,
        marginBottom: 30
    },
    cardListItem: {
        backgroundColor: '#2B3034',
        height: 52,
        borderColor: platform.brandDivider,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    cardListItemImage: {
        width: 40,
        marginRight: 16,
        alignItems: 'center'
    },
    cardListItemText: {
        fontSize: 20,
        lineHeight: 20
    },
    cardListItemTextMain: {
        marginLeft: 'auto',
        fontSize: 18,
        lineHeight: 20,
        color: platform.brandListItem
    },
    swipeButton: {
        width: 88,
        borderRadius: 0,
        height: 52,
        padding: 16,
        justifyContent: 'center'
    },
    swipeButtonText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center'
    }
};

export const modalCardStyles = {
    modal: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 30
    },
    hintRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 37
    },
    textRow: {},
    removeText: {
        fontSize: 28,
        lineHeight: 40,
        color: '#ffffff',
        fontFamily: platform.fontFamily
    },
    removeTextQuestion: {
        fontSize: 14,
        lineHeight: 20,
        color: '#ffffff',
        maxWidth: 211,
        fontFamily: platform.fontFamily
    },

    buttonRow: {
        flexDirection: 'row'
    },
    cancelButton: {
        flex: 1,
        marginRight: 14,
        height: 48,
        alignItems: 'center',
        borderRadius: 24
    },
    buttonText: {
        fontSize: 22,
        lineHeight: 31,
        textAlign: 'center',
        flex: 1,
        fontFamily: platform.fontFamily
    },
    removeButton: {
        flex: 1,
        height: 48,
        justifyContent: 'center'
    },
    okButton: {
        flex: 1,
        height: 48,
        justifyContent: 'center'
    }
};