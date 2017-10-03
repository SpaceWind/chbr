/*
@flow
 */
import React from 'react';
import {Button, Text, View} from "native-base";
import platform from "../../../../../native-base-theme/variables/platform";

export default class BonusPoint extends React.Component {

    props: {
        bonus: number;
        waitingBonus: number;
        showHint: number;
        navigation:any;
    };

    render() {
        return <View style={styles.block}>
            {this.props.showHint && <View style={styles.hintBlock}>
                <Text style={styles.header}>Бонусные баллы</Text>
                <Text>Бонусные баллы накапливаются при сканировании чека. 1 балл = 50 потраченных рублей.</Text>
            </View>}
            <View>
                <Text style={styles.bonusHeader}>Ваши баллы:</Text>
                <Text style={styles.bonusValue}>{this.props.bonus}</Text>
                {this.props.waitingBonus > 0 && <Text style={styles.text}>
                    {"*Еще " + this.props.waitingBonus + " бал. ожидают зачисления"}
                </Text>}
            </View>
            <View style={styles.buttonRow}>
                <Button warning rounded bordered onPress={()=>{
                    this.props.navigation.navigate('HowWorksPage')
                }}>
                    <Text uppercase={false}>Как накопить и тратить баллы?</Text>
                </Button>
            </View>
        </View>
    }
}


const styles = {
    block: {
        borderTopWidth: 2,
        borderColor: platform.brandDivider,
        paddingTop: 15,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    hintBlock: {
        paddingBottom: 9
    },
    header: {
        fontSize: 28,
        lineHeight: 40,
        color: platform.brandWarningAccent
    },
    bonusHeader: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarningAccent
    },
    bonusValue: {
        fontSize: 63,
        backgroundColor: 'transparent',
        marginTop: -15,
        marginBottom: -10
    },
    buttonRow: {
        width:'100%',
        paddingVertical: 15,
        justifyContent:'center',
        flexDirection:'row'
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
};