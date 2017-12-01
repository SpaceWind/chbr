import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";

import {Text, View} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {Image, ImageBackground, ScrollView} from "react-native";
import BonusPoint from "../common/BonusPoint/BonusPoint";


import DiscountExist from "../common/DiscountExist/index";
import LinearGradient from "react-native-linear-gradient";
import BonusIndicator from "../BonusIndicator/index";
import {getDiscountCode, getUserData, setSignState} from "../../../actions/user";
import moment from "moment";

export class DiscountPageC extends React.Component {


    state = {
        duration: null
    }

    bonusAmount = 100000;
    interval;
    expiredCode = null;

    componentWillMount() {
        this._loadData();
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }

    }

    render() {
        if (this.props.logged) {
            if (this.props.user) {
                let spend = this.props.user.money_spent;
                let discount = spend >= this.bonusAmount || this.props.user.discount > 0;
                if (!discount) {
                    return this.renderState(this.props.user.money_spent, this.props.user.bonus_balance, this.props.user.bonus_future);
                }
                else {
                    return this.renderBonus(this.props.user.bonus_balance, this.props.user.bonus_future);

                }
            }
            else {
                this.props.getUserData();
                return this.renderState(0, 0, 0);
            }
        }
        else {
            this.props.signIn();
            return <View></View>
        }

    }


    renderState(spend, bonus_balance, bonus_future) {
        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>

                <View style={styles.body}>

                    <View>
                        <Text style={styles.header}>Ваша скидка</Text>
                        <Text style={styles.hint}>Чтобы получить постоянную скидку 10%, необходимо совершить покупки
                            общей
                            суммой 100 000 ₽</Text>
                    </View>

                    <BonusIndicator spend={spend} bonusAmount={this.bonusAmount}>

                    </BonusIndicator>

                </View>

                <BonusPoint showHint={true} bonus={bonus_balance} waitingBonus={bonus_future}
                            navigation={this.props.navigation}>

                </BonusPoint>

            </ScrollView>
        </ImageBackground>)
    }

    renderBonus(bonus_balance, bonus_future) {
        return <View style={{backgroundColor: '#292D30', ...signStackStyle}}>
            <ScrollView>

                <DiscountExist duration={this.state.duration}
                               discount={this.props.user.discount}
                               code={this.props.discountCode && this.props.discountCode.code}/>


                <BonusPoint showHint={true} bonus={bonus_balance} waitingBonus={bonus_future}
                            navigation={this.props.navigation}>

                </BonusPoint>
            </ScrollView>
        </View>
    }


    async _loadData() {
        let result = await this.props.getUserData();
        let spend = result.money_spent;
        let discount = spend >= this.bonusAmount || this.props.user.discount > 0;
        if (discount) {
            try {
                await this.props.getDiscountCode();
                this._tick();
                this.interval = setInterval(() => {
                    this._tick()
                }, 1000)
            }
            catch (ex) {

            }
        }
    }


    _tick() {
        if (this.props.discountCode && this.props.discountCode !== this.expiredCode) {
            let now = moment.utc();
            let then = moment.utc(this.props.discountCode.expired_at);
            if (now > then) {
                this.expiredCode = this.props.discountCode;
                this.props.getDiscountCode();
                this.setState({
                    duration: null,
                    left: null
                });
            }
            else {
                this.setState({
                    duration: moment.utc(moment(then).diff(moment(now))),
                    left: null
                });

            }

        }
    }

}

function bindAction(dispatch) {
    return {
        getUserData: (text) => dispatch(getUserData()),
        signIn: () => dispatch(setSignState(true)),
        getDiscountCode: () => dispatch(getDiscountCode())
    };
}

const mapStateToProps = state => ({
    user: state.user.userData,
    logged: state.user.logged,
    discountCode: state.user.discountCode
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


};