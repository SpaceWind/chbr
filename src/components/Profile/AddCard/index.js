import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Icon, Left, List, ListItem, Picker, Right, Switch, Text,
    View
} from 'native-base';
import {Image, TouchableOpacity, Dimensions, ScrollView, ListView, Platform} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import InputBlock, {InputBlockStyles} from "../../Common/Form/InputBlock/index";
import {TextInputMask} from "react-native-masked-text";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Swipeout from "react-native-swipeout";
import ChesterIcon from "../../Common/ChesterIcon/index";
import MyModal from "../../Common/MyModal/index";
import {modalCardStyles} from "../Profile/index";
import {CardIOModule, CardIOUtilities} from 'react-native-awesome-card-io';

class AddCard extends React.Component {

    state = {
        push: true,
        isDateOpen: false,
        isCvvOpen: false,
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardholderName: null
    };

    componentWillMount() {
        if (Platform.OS === 'ios') {
            CardIOUtilities.preload();
        }
    }

    scanCard() {
        CardIOModule
            .scanCard()
            .then(card => {

                this.setState({
                    cardNumber: card.cardNumber,
                    expiry: ('0' + card.expiryMonth).slice(-2) + '/' + ('0' + card.expiryYear).slice(-2),
                    cvv: card.cvv,
                    cardholderName: card.cardholderName
                })
            })
            .catch(() => {
                // the user cancelled
            })
    }

    componentWillUnmount() {

    }

    render() {

        return <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>
            <KeyboardAwareScrollView
                resetScrollToCoords={{x: 0, y: 0}}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <ScrollView>

                    <View style={{marginTop: 30, borderColor: platform.brandDivider, borderTopWidth: 1,}}>
                        <View style={{...InputBlockStyles.inputBlockV, flexDirection: 'row', alignItems: 'center'}}>

                            <View style={{flex: 1}}>
                                < Text style={InputBlockStyles.inputLabelV}>
                                    Номер карты
                                </Text>

                                <TextInputMask
                                    style={InputBlockStyles.inputV}
                                    keyboardType="phone-pad"
                                    type={'custom'}
                                    ref={'phone'}
                                    value={this.state.cardNumber}
                                    options={{mask: '9999 9999 9999 9999 999'}}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) => {
                                        this.setState({cardNumber: text})
                                    }}
                                />
                            </View>

                            <TouchableOpacity onPress={this.scanCard.bind(this)}>
                                <ChesterIcon name="camera-24" size={24} color={platform.brandWarning}/>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{
                            ...InputBlockStyles.inputBlockV,
                            flex: 1,
                            borderColor: platform.brandDivider,
                            borderRightWidth: 1
                        }}>
                            <Text style={InputBlockStyles.inputLabelV}>
                                Срок действия
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TextInputMask
                                    style={{...InputBlockStyles.inputV, flex: 1, width: 'auto'}}
                                    keyboardType="phone-pad"
                                    type={'custom'}
                                    ref={'phone'}
                                    value={this.state.expiry}
                                    options={{mask: '99/99'}}
                                    placeholder={'ММ/ГГ'} placeholderTextColor={'#ffffff'}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) => {
                                        this.setState({expiry: text})
                                    }}
                                />
                                <TouchableOpacity style={{paddingVertical: 16, paddingHorizontal: 8}} onPress={() => {
                                    this.setState({isDateOpen: true});
                                }
                                }>
                                    <ChesterIcon name="question-16" size={16} color={platform.brandWarning}/>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{...InputBlockStyles.inputBlockV, flex: 1}}>
                            <Text style={InputBlockStyles.inputLabelV}>
                                CVV
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TextInputMask
                                    style={{...InputBlockStyles.inputV, flex: 1, width: 'auto'}}
                                    keyboardType="phone-pad"
                                    type={'custom'}
                                    ref={'phone'}
                                    value={this.state.cvv}
                                    placeholder={'XXX'} placeholderTextColor={'#ffffff'}
                                    options={{mask: '999'}}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) => {
                                        this.setState({cvv: text})
                                    }}
                                />
                                <TouchableOpacity style={{paddingVertical: 16, paddingHorizontal: 8}} onPress={() => {
                                    this.setState({isCvvOpen: true});
                                }}>
                                    <ChesterIcon name="question-16" size={16} color={platform.brandWarning}/>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>

                    <View style={{marginTop: 15, borderColor: platform.brandDivider, borderTopWidth: 1}}>
                        <InputBlock
                            name="Держатель"
                            placeholder={'Держатель карты'}
                            placeholderTextColor={'#ffffff'}
                            value={this.state.cardholderName}
                            onPress={(text) => {
                                this.setState({cardholderName: text});
                            }
                            }
                        />
                    </View>
                    <View style={{marginTop: 30, paddingHorizontal: 16}}>

                        <Button rounded warning style={{width: '100%', justifyContent: 'center'}}>
                            <Text uppercase={false}>Добавить карту</Text>
                        </Button>
                    </View>

                </ScrollView>
            </KeyboardAwareScrollView>

            <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.state.isDateOpen} ref="modal"
                     position={'bottom'}
                     onRequestClose={() => {
                         this.setState({isDateOpen: false})
                     }}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>Срок действия</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>Дата указана на лицевой стороне вашей
                                карты (под номером).</Text>
                        </View>
                        <Image source={require(`../../../../assets/images/payment/credit-card-date.png`)}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button rounded warning style={modalCardStyles.okButton} onPress={() => {
                            this.setState({isDateOpen: false})
                        }
                        }>
                            <Text style={modalCardStyles.buttonText} uppercase={false}>ОК</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>

            <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.state.isCvvOpen} ref="modal"
                     position={'bottom'}
                     onRequestClose={() => this.setState({isCvvOpen: false})}>
                <View style={modalCardStyles.modal}>
                    <View style={modalCardStyles.hintRow}>
                        <View style={modalCardStyles.textRow}>
                            <Text style={modalCardStyles.removeText}>CVV</Text>
                            <Text style={modalCardStyles.removeTextQuestion}>Трехзначный код на оборотной стороне
                                банковской карты.</Text>
                        </View>
                        <Image source={require(`../../../../assets/images/payment/credit-card-cvv.png`)}/>
                    </View>

                    <View style={modalCardStyles.buttonRow}>
                        <Button rounded warning style={modalCardStyles.okButton} onPress={() => {
                            this.setState({isCvvOpen: false})
                        }}>
                            <Text style={modalCardStyles.buttonText} uppercase={false}> ОК</Text>
                        </Button>
                    </View>

                </View>

            </MyModal>

        </Image>
    }


}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants
});
const AddCardSwag = connect(mapStateToProps, bindAction)(AddCard);
export default AddCardSwag;

const styles = {
    container: {
        flex: 1,
    },

}