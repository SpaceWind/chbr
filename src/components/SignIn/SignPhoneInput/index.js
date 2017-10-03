import React from 'react';
import PhoneInput from "react-native-phone-input";
import {Input, Text, View} from "native-base";
import platform from "../../../../native-base-theme/variables/platform";
import {TextInputMask} from 'react-native-masked-text';
import {Image} from "react-native";
export default class SignPhoneInput extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        isValid: false,
        text: '+7'
    };

    changeNumber(number) {


        this.setState({
            isValid: this.checkValid(number),
            text: number
        });
        this.props.onChangePhoneNumber(number.substring(1).replace(/\s/g, ''));
    }

    checkValid(number) {
        return number && number.replace(/\s/g, '').length === 12
    }

    isValidNumber() {
        return this.checkValid(this.state.text);
    }

    render() {

        let color = this.state.isValid ? platform.brandWarning : '#fff';
        return (
            <View style={styles.phone}>

                <Image source={require('../../../../assets/images/login&registration/russia-flag.png')}/>

                <TextInputMask
                    keyboardType="phone-pad"
                    type={'custom'}
                    ref={'phone'}
                    options={{mask: '+7 999 999 99 99'}}
                    style={{...styles.phoneInput, color: color}}
                    value={this.state.text}
                    keyboardAppearance="dark"
                    placeholder="+7"
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

