import React from 'react';
import {Input, Text, View} from "native-base";
import platform from "../../../../native-base-theme/variables/platform";
import {TextInputMask} from 'react-native-masked-text';
import {Image, TextInput} from "react-native";
import {parse, format, asYouType, isValidNumber} from 'libphonenumber-js'
import PhoneUtils from "../../Common/PhoneInput/PhoneUtils";

export default class SignPhoneInput extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        isValid: false,
        text: '+7'
    };

    changeNumber(number) {

        if (number.length === 0) {
            this.setState({
                isValid: false,
                text: '+'
            });
            this.props.onChangePhoneNumber(number.substring(1).replace(/\s/g, ''));
            return;
        }
        let result = PhoneUtils.getFormattedPhone(number);

        this.setState({
            isValid: result.isValid,
            text: result.phoneFormatted
        });
        this.props.onChangePhoneNumber(result.phone, result.isValid);
    }


    isValidNumber() {
        return this.state.isValid;
    }

    render() {

        let color = this.state.isValid ? platform.brandWarning : '#fff';
        return (
            <View style={styles.phone}>

                <Image source={require('../../../../assets/images/login&registration/russia-flag.png')}/>

                <TextInput
                    keyboardType="phone-pad"
                    type={'custom'}
                    ref={'phone'}
                    style={{...styles.phoneInput, color: color}}
                    value={this.state.text}
                    keyboardAppearance="dark"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => {


                        this.changeNumber(text)
                    }}
                />


            </View>

        );
    }
}


const styles = {
    phone: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    phoneInput: {
        fontSize: platform.inputFontSize,
        fontFamily: platform.fontFamily,

        borderWidth: 0,
        marginLeft: 7,
        flex: 1

    }

};

