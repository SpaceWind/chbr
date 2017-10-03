/*
@flow
 */
import React from 'react';
import {Button, Text, View} from "native-base";
import platform from "../../../../../native-base-theme/variables/platform";
import {signStackStyle} from "../../../../routers/SignStack";
import {Image} from "react-native";
import QRCode from "react-native-qrcode";
import LinearGradient from "react-native-linear-gradient";

export default class DiscountExist extends React.Component {

    props: {
        qrCode: string;
    };

    state = {
        showQr: false
    }

    componentDidMount() {

        setTimeout(() => {
            this.setState({showQr: true})
        }, 1500)
    }

    render() {


        return <View>

            <Image source={require('../../../../../assets/images/my_card/pattern-cocktail.png')}
                   style={{width: '100%'}}>
                <View style={styles.block}>

                    <Text style={styles.header}>Ваша скидка 10%</Text>
                    <Text style={styles.text}>Покажите ваш QR-код официанту,
                        чтобы получить скидку</Text>
                    <View style={styles.qrBlock}>
                        <LinearGradient
                            colors={['#FBDA61', '#F76B1C']}
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            style={styles.qrBlockGradient}
                        >
                        </LinearGradient>
                        <View style={styles.qrInnerBlock}>
                            {this.state.showQr ? <QRCode
                                value={'http://facebook.github.io/react-native/'}
                                size={168}
                                bgColor='#292D30'
                                fgColor='white'/> : <View style={{width: 168, height: 168}}/>}
                        </View>

                    </View>
                </View>
            </Image>
        </View>
    }
}


const styles = {
    block: {
        paddingTop: 15,
        width: '100%',
        alignItems: 'center',
        paddingBottom: 30
    },
    header: {
        fontSize: 28,
        lineHeight: 40,
        color: platform.brandWarningAccent
    },
    text: {
        paddingTop: 5,
        paddingHorizontal: 30,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent,
        textAlign: 'center'
    },
    qrBlock: {
        marginTop: 20,
        padding: 2
    },
    qrInnerBlock: {
        padding: 7,
        backgroundColor: '#292D30'
    },
    qrBlockGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
};