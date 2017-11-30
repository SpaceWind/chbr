import React from 'react';

import {Button, Text, View} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";

import {Image, ImageBackground, ScrollView, TouchableOpacity} from "react-native";
import {signStackStyle} from "../../../routers/SignStack";


export default class HowWorksPage extends React.Component {

    render() {

        return (<Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

            <ScrollView>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerStart}>Как заработать баллы?</Text>
                    <Image style={styles.headerImage}
                           source={require('../../../../assets/images/howworks/bonus_icon.png')}/>
                </View>
                {false && <View style={styles.pointRow}>

                    <View style={styles.pointBlock}>
                        <Text style={styles.pointNumber}>1</Text>
                    </View>

                    <Text style={styles.pointText}>При первом заказе мы дарим вам
                        200 бонусных баллов!</Text>
                </View>}
                <View style={styles.pointRow}>

                    <Text style={styles.pointText}>Сканируйте QR-коды с чека после оплаты счета в ресторане.</Text>
                </View>

                <Image style={styles.image} source={require('../../../../assets/images/howworks/qr-pic.png')}/>
                {false && <View style={styles.pointRow}>
                    <View style={styles.pointBlock}>
                        <Text style={styles.pointNumber}>3</Text>
                    </View>
                    <Text style={styles.pointText}>Расскажите вашим друзьям о приложении в социальных сетях и получите
                        50
                        баллов.</Text>
                </View>}
                {false && <View style={styles.networkBlock}>
                    <TouchableOpacity>
                        <Image style={styles.networkIcon}
                               source={require('../../../../assets/images/howworks/VK.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.networkIcon}
                               source={require('../../../../assets/images/howworks/Instagram.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.networkIcon}
                               source={require('../../../../assets/images/howworks/Facebook.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.networkIcon}
                               source={require('../../../../assets/images/howworks/Twitter.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.networkIcon}
                               source={require('../../../../assets/images/howworks/OK.png')}/>
                    </TouchableOpacity>
                </View>}
                {false && <View style={styles.pointRow}>
                    <View style={styles.pointBlock}>
                        <Text style={styles.pointNumber}>4</Text>
                    </View>
                    <Text style={styles.pointText}>Оцените наше приложение в AppStore и получите дополнительные 40
                        баллов!</Text>
                </View>}
                {false && <View style={styles.buttonBlock}>
                    <Button warning rounded block>
                        <Text uppercase={false}>Оценить приложение</Text>
                    </Button>
                </View>}
                <View style={styles.textBlock}>
                    <Text style={styles.header}>На что потратить?</Text>
                    <Text style={styles.text}>Обменивайте свои баллы на бонусные десерты и напитки в приложении!</Text>
                </View>
                <Image style={styles.image} source={require('../../../../assets/images/howworks/spend-pic.png')}/>

            </ScrollView></Image>)
    }


}

const styles = {
    container: {
        flex: 1,
    },
    headerBlock: {
        paddingHorizontal: 16,
        marginTop: 23,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerStart: {
        color: platform.brandWarningAccent,
        fontSize: 28,
        lineHeight: 40,
        maxWidth: 180
    },
    header: {
        color: platform.brandWarningAccent,
        fontSize: 28,
        lineHeight: 40
    },
    headerImage: {
        height: 93,
        width: 101
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent,
        marginBottom: 18
    },
    pointRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 18
    },
    pointBlock: {
        width: 24,
        height: 24,
        marginRight: 8,
        borderRadius: 12,
        backgroundColor: platform.brandWarningAccent,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pointText: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent,
        marginBottom: 18
    },
    networkBlock: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom: 27
    },
    networkIcon: {
        width: 48,
        height: 48
    },
    image: {
        marginBottom: 20,
        height: 145,
        width: '100%'
    },
    buttonBlock: {
        marginBottom: 30,
        paddingHorizontal: 16
    },
    textBlock: {
        paddingHorizontal: 16
    }

};