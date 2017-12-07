import React from 'react';
import {Text, View} from 'native-base';
import {Image, TouchableWithoutFeedback, TextInput} from "react-native";
import platform from "../../../../../native-base-theme/variables/platform";


export default class InputBlock extends React.Component {


    componentWillMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return <View style={InputBlockStyles.inputBlock}>
            <TouchableWithoutFeedback onPress={() => {
                this.refs.input.focus();
            }}>
                <Text
                    style={InputBlockStyles.inputLabel}>{this.props.name}</Text>
            </TouchableWithoutFeedback>
            <TextInput ref='input' style={InputBlockStyles.input} underlineColorAndroid="transparent" {...this.props}/>
        </View>
    }
}


export const InputBlockStyles = {
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
        paddingVertical: 16,
        color: "#fff"
    },
    inputBlockV: {
        backgroundColor: '#2B3034',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: platform.brandDivider
    },
    inputLabelV: {
        paddingTop: 15,
        color: '#B3BBC1',
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 20,
    },
    inputV: {
        width: '100%',
        fontFamily: platform.fontFamily,
        fontSize: 20,
        paddingVertical: 16,
        color: "#fff"
    }
};
