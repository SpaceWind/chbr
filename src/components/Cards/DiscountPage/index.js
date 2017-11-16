import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";

import {Text, View} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {Image, ScrollView} from "react-native";
import BonusPoint from "../common/BonusPoint/BonusPoint";


import DiscountExist from "../common/DiscountExist/index";
import LinearGradient from "react-native-linear-gradient";

export class DiscountPageC extends React.Component {


    bonusAmount = 100000;

    render() {
        if (this.props.user) {
            let spend = this.props.user.money_spent;
            let discount = spend >= this.bonusAmount;
            if (!discount) {
                return this.renderState(this.props.user.money_spent, this.props.user.bonus_balance, this.props.user.bonus_future);
            }
            else {
                return this.renderBonus(this.props.user.bonus_balance, this.props.user.bonus_future);

            }
        }
        else {
            return this.renderState(0, 0, 0);
        }
    }


    renderState(spend,bonus_balance,bonus_future) {
        let left = this.bonusAmount - spend;

        let bonusIndicatorStyle = {...styles.bonusIndicatorValue, width:  ((spend / this.bonusAmount)*100)+'%'};

        return (<Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

            <ScrollView>

                <View style={styles.body}>

                    <View>
                        <Text style={styles.header}>Ваша скидка</Text>
                        <Text style={styles.hint}>Чтобы получить постоянную скидку 10%, необходимо совершить покупки
                            общей
                            суммой 100 000 ₽</Text>
                    </View>

                    <View style={styles.amountBlocks}>
                        <View style={styles.amountBlock}>
                            <Text style={styles.amountHeader}>Вы потратили</Text>
                            <Text style={styles.amountValue}>{spend + ' ₽'}</Text>
                        </View>
                        <View style={styles.amountBlock}>
                            <Text style={styles.amountHeader}>Осталось до скидки</Text>
                            <Text style={styles.amountValue}>{left + ' ₽'}</Text>
                        </View>
                    </View>
                    <View style={styles.bonusIndicatorBlock}>
                        <View style={styles.bonusIndicator}>


                            <LinearGradient
                                id="grad"
                                colors={['#FBDA61', '#F76B1C']}
                                start={{x:0, y:0}}
                                end={{x:1, y:0}}
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

                <BonusPoint showHint={true} bonus={bonus_balance} waitingBonus={bonus_future} navigation={this.props.navigation}>

                </BonusPoint>

            </ScrollView>
        </Image>)
    }

    renderBonus(bonus_balance, bonus_future) {
        return <View style={{backgroundColor: '#292D30', ...signStackStyle}}>
            <ScrollView>
                <DiscountExist qrCode={'cc'}/>
                <BonusPoint showHint={true} bonus={bonus_balance} waitingBonus={bonus_future} navigation={this.props.navigation}>

                </BonusPoint>
            </ScrollView>
        </View>
    }

}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    user: state.user.userData
});
const DiscountPage = connect(mapStateToProps, bindAction)(DiscountPageC);
export default DiscountPage;

const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingTop: 15,
        paddingBottom: 21
    },
    header: {
        fontSize: 28,
        lineHeight: 40,
        color: platform.brandWarningAccent
    },
    hint: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
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
        marginTop: -10
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