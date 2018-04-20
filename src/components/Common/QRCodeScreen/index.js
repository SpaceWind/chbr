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
import ChesterIcon from "../ChesterIcon/index";


class QRCodeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {torchEnabled: false};
    }

    state: {
        torchEnabled: false;
    }

    _onPressCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    _onBarCodeRead(result) {

        if (this.barCodeFlag && !this.props.isScanDisabled) {
            this.barCodeFlag = false;
            Vibration.vibrate();
            setTimeout(() => {
                this.props.onSuccess(result.data);
            }, 100);
        }
    }

    _onToggleTorch() {
        this.setState(prevState => {return {torchEnabled: !prevState.torchEnabled}});
    }

    render() {
        let cancelButton = null;
        this.barCodeFlag = true;

        if (this.props.cancelButtonVisible) {
            cancelButton =
                <CancelButton onPress={this._onPressCancel.bind(this)} title={this.props.cancelButtonTitle}/>;
        }

        return (
            <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera}
                torchMode={this.state.torchEnabled ? Camera.constants.TorchMode.on : Camera.constants.TorchMode.off}>
                <View style={styles.rectangleContainer}>
                    <View style={styles.rectangle}/>
                </View>
                <View style={styles.buttonsView}>
                    {cancelButton}
                    <Button warning rounded onPress={this._onToggleTorch.bind(this)}>
                        <ChesterIcon name="flashlight" size={20} color="#fff"/>
                    </Button>
                </View>
            </Camera>
        );
    }
}

class CancelButton extends React.Component {
    render() {
        return (
                <Button warning rounded
                        onPress={this.props.onPress}>
                    <Text uppercase={false}>{this.props.title}</Text>
                </Button>
        );
    }
}

const styles = {
    camera: {
        flex: 1,
        alignItems: 'stretch',
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
    torchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
        maxWidth: 50,
        alignSelf: 'flex-end',
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#0097CE',
    },
};

module.exports = QRCodeScreen;
