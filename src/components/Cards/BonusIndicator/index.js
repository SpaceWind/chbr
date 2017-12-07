/*
@flow
 */
import React from 'react';
import {Button, Text, View} from "native-base";
import platform from "../../../../native-base-theme/variables/platform";
import {Image, Platform} from "react-native";

import LinearGradient from "react-native-linear-gradient";

export default class BonusIndicator extends React.Component {

    props: {
        spend: number,
        bonusAmount: number
    };

    state = {};

    componentDidMount() {

    }

    render() {
        let left = this.props.bonusAmount - this.props.spend;

        let spend = this.props.spend > 1000 ? this.props.spend : 1000;

        if (Platform.OS !== 'ios' && this.props.spend < 3000) {
            spend = 3000
        }


        let bonusIndicatorStyle = {
            ...styles.bonusIndicatorValue,
            width: ((spend / this.props.bonusAmount) * 100) + '%'
        };

        return <View>
            <View style={styles.amountBlocks}>
                <View style={styles.amountBlock}>
                    <Text style={styles.amountHeader}>Вы потратили</Text>
                    <Text
                        style={styles.amountValue}>{this.props.spend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'}</Text>
                </View>
                <View style={styles.amountBlock}>
                    <Text style={styles.amountHeader}>Осталось до скидки</Text>
                    <Text
                        style={styles.amountValue}>{left.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'}</Text>
                </View>
            </View>
            <View style={styles.bonusIndicatorBlock}>
                <View style={styles.bonusIndicator}>


                    <LinearGradient
                        id="grad"
                        colors={['#FBDA61', '#F76B1C']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={bonusIndicatorStyle}
                    >
                    </LinearGradient>

                    <View style={styles.bonusIndicatorDiv}>

                    </View>
                    <View style={styles.bonusStar}>
                        <Image source={require(`../../../../assets/images/my_card/star.png`)}/>

                    </View>
                </View>
                <View style={styles.bonusDimension}>
                    <Text style={{
                        flex: 1,

                    }}> 0 ₽</Text>
                    <Text style={{
                        flex: 1,
                        textAlign: 'center'
                    }}>50 000 ₽</Text>
                    <Text style={{
                        flex: 1,
                        textAlign: 'right'
                    }}>100 000 ₽</Text>
                </View>
            </View>

        </View>
    }
}


const styles = {
    amountBlocks: {
        flexDirection: 'row',
        marginTop: 12
    },
    amountBlock: {
        flex: 1
    },
    amountHeader: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarningAccent
    },
    amountValue: {
        fontSize: 30,
        lineHeight: 43,
        marginTop: -5
    },
    bonusIndicatorBlock: {
        width: '100%',
        marginTop: 17
    },
    bonusIndicator: {
        width: '100%',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#7A8187',
        height: 16,
        overflow: 'hidden'
    },
    bonusIndicatorDiv: {
        borderRightWidth: 1,
        borderRightColor: '#7A8187',
        height: 8,
        position: 'absolute',
        top: 3,
        right: '50%'

    },
    bonusIndicatorValue: {
        borderRadius: 50,
        height: 16,
        margin: -1,
        width: '25%'
    },
    bonusStar: {
        position: 'absolute',
        right: -1,
        top: -1
    },
    bonusDimension: {
        flexDirection: 'row',
    }
};