//@flow

import React from 'react';
import {Input, Text, View} from "native-base";
import platform from "../../../../native-base-theme/variables/platform";
import {Image, TextInput} from "react-native";
import {parse, format, asYouType, isValidNumber} from 'libphonenumber-js'
import PhoneUtils from "./PhoneUtils";

export default class PhoneInput extends React.Component {


    props: {
        value: string,
        onChangeText: (number: string, isValid: boolean) => void
    }

    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            text: '+7'
        };
        if (props.value) {
            let result = PhoneUtils.getFormattedPhone(props.value);
            this.state = {
                isValid: result.isValid,
                text: result.phoneFormatted
            };
        }
    }


    changeNumber(number) {

        if (number.length === 0) {
            this.setState({
                isValid: false,
                text: '+'
            });
            this.props.onChangeText(number.substring(1).replace(/\s/g, ''));
            return;
        }
        let result = PhoneUtils.getFormattedPhone(number);
        this.setState({
            isValid: result.isValid,
            text: result.phoneFormatted
        });
        this.props.onChangeText(result.phone, result.isValid);
    }


    isValidNumber() {
        return this.state.isValid;
    }

    focus() {
        this.refs.phone.focus();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            let result = PhoneUtils.getFormattedPhone(nextProps.value);
            this.setState({
                isValid: result.isValid,
                text: result.phoneFormatted
            });
        }
    }

    render() {
        return (
            <TextInput
                keyboardType="phone-pad"
                type={'custom'}
                ref={'phone'}
                editable={this.props.editable}
                style={this.props.style}
                value={this.state.text}
                keyboardAppearance="dark"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                onChangeText={(text) => {
                    this.changeNumber(text)
                }}
            />
        );
    }
}


const styles = {};

