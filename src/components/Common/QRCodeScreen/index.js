'use strict';
// @flow

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    VibrationIOS,
} from "react-native";

import Camera from 'react-native-camera';
import {Button, Text} from "native-base";
import {Vibration} from "react-native";

class QRCodeScreen extends React.Component{

    /*props: {
        cancelButtonVisible: number,
        cancelButtonTitle: string,
        onSucess: ()=>{},
        onCancel:()=>{},
    },*/


    _onPressCancel() {

        if (this.props.onCancel) {
            this.props.onCancel();
        }

    }

    _onBarCodeRead(result) {

        if (this.barCodeFlag) {
            this.barCodeFlag = false;

            setTimeout(()=>{
                Vibration.vibrate();
                this.props.onSuccess(result.data);
            }, 100);
        }
    }

    render () {
        let cancelButton = null;
        this.barCodeFlag = true;

        if (this.props.cancelButtonVisible) {
            cancelButton = <CancelButton onPress={this._onPressCancel.bind(this)} title={this.props.cancelButtonTitle}/>;
        }

        return (
            <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera}>
                <View style={styles.rectangleContainer}>
                    <View style={styles.rectangle}/>
                </View>
                {cancelButton}
            </Camera>
        );
    }
}

class CancelButton  extends React.Component{
    render() {
        return (
            <View style={styles.cancelButton}>
                <Button warning rounded style={{flex: 1, justifyContent: 'center'}}
                        onPress={this.props.onPress}>
                    <Text uppercase={false}>{this.props.title}</Text>
                </Button>
            </View>
        );
    }
}

const styles = {
    camera: {
        flex: 1,
        alignItems: 'center',
    },

    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'transparent',
    },

    cancelButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
        maxWidth: 200


    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#0097CE',
    },
};

module.exports = QRCodeScreen;