import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ScrollView, Alert, ImageBackground} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";

import QRCodeScreen from "../../Common/QRCodeScreen/index";
import {checkBill, getUserData} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";

import LinearGradient from "react-native-linear-gradient";
import BonusIndicator from "../BonusIndicator/index";
import { NavigationActions } from 'react-navigation'


export class ScanBillPageC extends React.Component {


    state = {
        end: false,
    };

    bonusAmount = 100000;

    componentWillMount() {

    }

    componentWillUnmount() {

    }


    render() {


        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>

            {
                !this.state.loading &&

                <View style={signStackStyle}>
                    {this.state.end ? this.renderResult() : this.renderCamera()}
                </View>
            }


        </ImageBackground>)
    }


    back()
    {
        const backAction = NavigationActions.back();
        this.props.navigation.dispatch(backAction)
    }

    async checkBill(code) {
        this.setState({loading: true});
        try {
            let result = await this.props.checkBill(code);
            console.log(result);
            let userDate = await this.props.getUserData();
            this.setState({end: true, checkSum: result.summ});
            this.setState({loading: false});
        }
        catch (ex) {
            console.log(ex);
            setTimeout(() => {
                Alert.alert(
                    'Ошибка сканирования',
                    'Возможно чек некорректен или уже отсканирован. Попробовать снова?',
                    [

                        {
                            text: 'Нет', onPress: () => {

                            this.back();

                        }
                            , style: 'cancel'
                        },
                        {
                            text: 'Ок'
                            , onPress: () => {

                            this.setState({loading: false});

                        }
                        }
                    ]
                )
            }, 100);
        }

    }


    renderCamera() {
        return <View style={styles.cameraContainer}>
            <QRCodeScreen
                onSuccess={(qrCode) => {
                    this.checkBill(qrCode);
                }}
                onCancel={() => {
                   this.back();
                }}
                cancelButtonVisible={true}
                cancelButtonTitle={'Отмена'}>

            </QRCodeScreen>
        </View>
    }

    renderResult() {


        let spend = this.props.user.money_spent;
        let discount = spend >= this.bonusAmount;


        return <ScrollView>
            <View>
                <View>

                    <ImageBackground source={require('../../../../assets/images/my_card/pattern-cocktail.png')}
                                     style={{width: '100%'}}>
                        <View style={styles.block}>


                            <View style={styles.bonusWrap}>
                                <View style={styles.bonusBlock}>
                                    <LinearGradient
                                        colors={['#FBDA61', '#F76B1C']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}
                                        style={styles.bonusBlockGradient}
                                    >
                                    </LinearGradient>
                                    <View style={styles.bonusInnerBlock}>

                                        <Text style={styles.bonusText}>{parseInt(this.state.checkSum / 50)}</Text>
                                        <Text style={styles.bonus}>баллов</Text>
                                    </View>


                                </View>
                                <Image source={require('../../../../assets/images/my_card/ok.png')}
                                       style={styles.bonusSuccessIcon}>
                                </Image>
                            </View>


                            <Text style={styles.header}>Чек на сумму {this.state.checkSum}₽ успешно отсканирован!</Text>
                            <Text style={styles.text}>Баллы будут доступны после 12:00 следующего дня</Text>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.bonusContainer}>
                    <Text style={styles.bonusHeader}>Ваши баллы:</Text>
                    <Text style={styles.bonusValue}>{this.props.user.bonus_balance}</Text>
                    {this.props.user.bonus_future > 0 && <Text style={styles.bonusFuture}>
                        {"*Еще " + this.props.user.bonus_future + " бал. ожидают зачисления"}
                    </Text>}
                </View>
                {!discount && <View style={styles.bonusIndicatorBlock}>
                    <BonusIndicator spend={spend} bonusAmount={this.bonusAmount}>

                    </BonusIndicator>
                </View>}


            </View>
        </ScrollView>
    }
}

function bindAction(dispatch) {
    return {
        checkBill: (code) => {
            return dispatch(checkBill(code));
        },
        getUserData: () => dispatch(getUserData()),
    };
}

const mapStateToProps = state => ({
    history: state.user.history,
    user: state.user.userData
});

const ScanBillPage = connect(mapStateToProps, bindAction)(ScanBillPageC);
export default ScanBillPage;

const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textBlock: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarning
    },
    value: {
        fontSize: 63,
        lineHeight: 95,
        color: '#fff'
    },
    hint: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
    cameraContainer: {
        flex: 1,
        width: null,
        height: null,
    },

    bonusContainer: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: platform.brandDivider,
        paddingTop: 15,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    bonusHeader: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarningAccent,
    },
    bonusValue: {
        fontSize: 63,
        backgroundColor: 'transparent',
        marginTop: -15,
        marginBottom: -10
    },
    bonusFuture: {
        paddingTop: 5,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },

    block: {
        paddingTop: 15,
        width: '100%',
        alignItems: 'center',
        paddingBottom: 30
    },
    header: {
        fontSize: 28,
        lineHeight: 40,
        color: platform.brandWarningAccent,
        textAlign: 'center',
        maxWidth: 300
    },
    text: {
        paddingTop: 5,
        paddingHorizontal: 30,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent,
        textAlign: 'center'
    },

    bonusWrap: {
        marginTop: 20,
    },
    bonusBlock: {

        padding: 2,
        borderRadius: 55,
        overflow: 'hidden'
    },
    bonusInnerBlock: {
        padding: 7,
        backgroundColor: '#292D30',
        width: 110,
        height: 110,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center'

    },
    bonusBlockGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    bonusText: {
        fontSize: 44
    },
    bonus: {
        fontSize: 14
    },
    bonusIndicatorBlock: {
        paddingTop: 8,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    bonusSuccessIcon: {
        width: 34,
        height: 34,
        position: 'absolute',
        right: 0

    }


};