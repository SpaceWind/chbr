import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView, Alert} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import historyStyles from "../common/historyStyle";
import {deleteOperation, getTableReserves, getUserData} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import {NavigationActions} from "react-navigation";

export class ScanBillPageC extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};

    componentWillMount() {
        this.props.getUserData();
    }

    componentWillUnmount() {

    }


    render() {

        let history = this.props.navigation.state.params.history;

        history.price = history.summ;

        let restaurant = this.props.restaurants[history.restaurant_id];
        let restaurantName = restaurant.title_short;

        this.operation = history;

        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <View style={historyStyles.scrollContainer}>
                    <Spinner visible={this.props.isOperationPending || this.state.loading}
                             textStyle={{color: '#FFF'}}/>
                    <HistoryShortInfo info={history} result={history.result_data} restaurantName={restaurantName}/>

                    <View style={styles.body}>
                        <View style={styles.textBlock}>
                            <View style={{marginRight: 50}}>
                                <Text style={styles.title}>Ваши баллы:</Text>
                                <Text style={styles.value}>{this.props.user.bonus_balance}</Text>
                            </View>
                            <View>
                                <Text style={styles.title}>Будет начислено:</Text>
                                <Text style={styles.value}>+{history.bonus}</Text>
                            </View>
                        </View>
                        {history.status !== 5 &&
                        <Text style={styles.hint}>Бонусы будут доступны после 12:00 следующего дня</Text>}
                    </View>


                    {(history.status === 5 || history.status === 6) && <View style={styles.buttonBlock}>

                        <View style={{
                            width: '100%', paddingHorizontal: 7,
                        }}>
                            <Button danger full rounded
                                    style={{
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => {
                                        this._requestDelete()
                                    }}><Text uppercase={false}>Удалить из истории</Text>
                            </Button>
                        </View>


                    </View>}

                </View>


            </ScrollView>
        </ImageBackground>)
    }

    _requestDelete() {
        Alert.alert(
            'Вы уверены?',
            'Данная информация будет удалена из истории',
            [
                {
                    text: 'Нет', onPress: () => {
                }, style: 'cancel'
                },
                {
                    text: 'Ок', onPress: () => {
                    this._cancelOperation()
                }
                }
            ]
        );
    }

    async _cancelOperation() {
        this.setState({loading: true});
        try {
            let result = await this.props.deleteOperation(this.operation.id);
            this.props.getTableReserves();
            this.setState({loading: false});
            const backAction = NavigationActions.back();
            this.props.navigation.dispatch(backAction)
        }
        catch
            (ex) {
            this.setState({loading: false});
            setTimeout(() => {
                Alert.alert(
                    'Ошибка',
                    'Не удалось выполнить операцию',
                    [

                        {
                            text: 'Ок', onPress: () => {


                        }
                        }
                    ]
                )
            }, 10);
        }

    }
}

function bindAction(dispatch) {
    return {
        getUserData: () => dispatch(getUserData()),
        getTableReserves: () => {
            return dispatch(getTableReserves());
        },
        deleteOperation: (id) => {
            return dispatch(deleteOperation(id));
        }
    };
}

const mapStateToProps = state => ({
    user: state.user.userData,
    restaurants: state.restaurant.restaurants,
});

const ScanBillPage = connect(mapStateToProps, bindAction)(ScanBillPageC);
export default ScanBillPage;


const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 11,
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
        backgroundColor: 'transparent',
        marginTop: -10,
        marginBottom: -4
    },
    hint: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
    buttonBlock: {
        marginTop: 'auto',
        marginBottom: 30,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    }
};