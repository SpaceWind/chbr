/*
@flow
 */
import React from 'react';
import {Text, View} from "native-base";
import platform from "../../../../../native-base-theme/variables/platform";

export default class FieldValue extends React.Component {

    props: {
        name: string,
        value: string
    };


    render() {

        return <View style={FiledValueStyles.field}>
            <Text style={FiledValueStyles.name}>{this.props.name}</Text>
            <Text style={FiledValueStyles.value}>{this.props.value}</Text>
        </View>

    }
}


export const FiledValueStyles = {
    field: {
        paddingTop: 8
    },
    name: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarning
    },
    value: {
        fontSize: 20,
        lineHeight: 29,
        color: '#fff'
    },
};