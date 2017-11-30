/*
@flow
 */
import React from 'react';
import {Button, Text, View} from "native-base";
import platform from "../../../../../native-base-theme/variables/platform";
import {signStackStyle} from "../../../../routers/SignStack";
import {ActivityIndicator, Image, ImageBackground} from "react-native";
import QRCode from "react-native-qrcode";
import LinearGradient from "react-native-linear-gradient";
import ChesterIcon from "../../../Common/ChesterIcon/index";

export default class DiscountExist extends React.Component {

    props: {
        duration: any;
        code: any;
        discount: any;
    };

    state = {
        showQr: false
    };

    componentDidMount() {


    }

    render() {


        return <View>

            <ImageBackground source={require('../../../../../assets/images/my_card/pattern-cocktail.png')}
                             style={{width: '100%'}}>
                <View style={styles.block}>

                    {this.props.discount && <Text style={styles.header}>Ваша скидка {this.props.discount}%</Text>}
                    <Text style={styles.text}>Назовите или покажите ваш код официанту,
                        чтобы получить скидку</Text>
                    <View style={styles.bonusBlock}>


                        {
                            this.props.code ?
                                <Text style={styles.bonusCode}>{this.props.code}</Text> :
                                <ActivityIndicator
                                    style={styles.activityIndicator}

                                />
                        }

                        <View style={styles.bonusBlockGradient}>
                            <LinearGradient
                                colors={['#F76B1C', '#FBDA61', '#F76B1C']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                                style={styles.bonusGradient}
                            >
                            </LinearGradient>
                        </View>


                    </View>

                    <View style={styles.bonusTimeBlock}>
                        {this.props.duration && <View style={styles.bonusTime}>
                            <ChesterIcon name="time-16" size={16}
                                         color="#fff"
                                         style={styles.bonusTimeIcon}
                            />
                            <Text style={styles.bonusTimeText}>{this.props.duration}</Text>

                        </View>}
                    </View>

                </View>
            </ImageBackground>
        </View>
    }
}


const styles = {
    block: {

        width: '100%',
        alignItems: 'center',
        paddingBottom: 56
    },
    header: {
        fontSize: 28,
        marginTop: 45,
        lineHeight: 40,
        color: platform.brandWarningAccent,
        backgroundColor:'transparent'
    },
    text: {
        paddingTop: 5,
        paddingHorizontal: 30,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent,
        textAlign: 'center',
        backgroundColor:'transparent'
    },
    bonusBlock: {
        marginTop: 40,
        width: '100%',
        backgroundColor: "#2B3034",
        height: 70
    },
    activityIndicator: {
        marginTop: 25
    },
    bonusCode: {
        fontSize: 42,
        lineHeight: 62,
        textAlign: 'center'
    },
    bonusBlockGradient: {
        marginTop: 'auto',
        width: '100%',
        backgroundColor: "#3B4248",
        paddingHorizontal: 28
    },
    bonusGradient: {
        width: '100%',
        height: 4
    },
    bonusTimeBlock: {
        height: 16
    },
    bonusTime: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'transparent',
    },
    bonusTimeIcon: {
        marginRight: 5
    },
    bonusTimeText: {
        minWidth: 40
    }
};