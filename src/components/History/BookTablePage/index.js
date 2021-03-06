import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView, Alert} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue, {FiledValueStyles} from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import {deleteOperation, getOperation, getReserve, getTableReserves} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import {cancelReserve} from "../../../actions/restaurant";
import {NavigationActions} from "react-navigation";
import {MaskService} from 'react-native-masked-text'
import PhoneUtils from "../../Common/PhoneInput/PhoneUtils";

class BookTablePageC extends React.Component {


    state = {};
    getReserve = true;

    constructor(props) {
        super(props);
        this.reserveId = this.props.navigation.state.params.reserveId;
    }

    componentWillMount() {
        this.props.getOperation(this.reserveId);
    }

    componentWillUnmount() {

    }


    render() {
        let operation = this.props.operation;
        let reserve = this.props.reserve;
        if (reserve) {

        }
        let restaurantName = '';
        if (operation) {
            let restaurant = this.props.restaurants[operation.restaurant_id];
            restaurantName = restaurant.title_short;
        }
        console.log(operation);

        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <Spinner visible={this.props.isOperationPending || this.state.loading}
                         textStyle={{color: '#FFF'}}/>
                {operation && <View style={historyStyles.scrollContainer}>


                    <HistoryShortInfo info={operation} result={operation.result_data} restaurantName={restaurantName}/>


                    {reserve && <View style={styles.body}>
                        <FieldValue name="Телефон" value={this._getPhoneFormatted(reserve.client_phone)}/>
                        <FieldValue name="Имя и фамилия" value={reserve.client_name}/>
                        {reserve.comment !== null || reserve.comment !== '' &&
                        <FieldValue name="Комментарий к заказу" value={reserve.comment}/>}
                    </View>}


                    {operation.status !== 5 && operation.status !== 6 && <View style={styles.buttonBlock}>

                        <View style={{
                            width: '100%', paddingHorizontal: 7,
                        }}>
                            <Button danger full rounded
                                    style={{
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => {
                                        this._requestCancel()
                                    }}><Text uppercase={false}>Отменить</Text>
                            </Button>
                        </View>


                    </View>}

                    {(operation.status === 5 || operation.status === 6) && <View style={styles.buttonBlock}>

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

                </View>}


            </ScrollView>
        </ImageBackground>)
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.operation && this.getReserve) {
            this._getReserve(nextProps.operation);
            this.getReserve = false;
        }

    }

    _getPhoneFormatted(phone) {
        let result = PhoneUtils.getFormattedPhone(phone);
        return result.phoneFormatted;
    }

    async _getReserve(operation) {
        try {
            await this.props.getReserve(operation.restaurant_id, operation.result_id);
        }
        catch
            (ex) {
            setTimeout(() => {
                Alert.alert(
                    'Ошибка',
                    'Не удалось загрузить информацию.',
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


    _requestCancel() {
        Alert.alert(
            'Вы уверены?',
            'Заказ на бронирование будет удален.',
            [
                {
                    text: 'Нет', onPress: () => {
                }, style: 'cancel'
                },
                {
                    text: 'Ок', onPress: () => {
                    this._cancelReserve()
                }
                }
            ]
        );
    }


    async _cancelReserve() {
        this.setState({loading: true});
        try {
            await this.props.cancelReserve(this.props.operation.restaurant_id, this.props.operation.result_id);
            let result = await this.props.deleteOperation(this.props.operation.id);
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
            let result = await this.props.deleteOperation(this.props.operation.id);
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
        getReserve: (restaurantId, reserveId) => {
            dispatch(getReserve(restaurantId, reserveId));
        },
        getOperation: (operationId) => {
            dispatch(getOperation(operationId));
        },
        getTableReserves: () => {
            return dispatch(getTableReserves());
        },
        cancelReserve: (restaurantId, reserveId) => {
            dispatch(cancelReserve(restaurantId, reserveId));
        },
        deleteOperation: (id) => {
            return dispatch(deleteOperation(id));
        }
    };
}

const mapStateToProps = state => ({
    reserve: state.user.reserve,
    restaurants: state.restaurant.restaurants,
    isReservePending: state.user.isReservePending,
    isOperationPending: state.user.isOperationPending,
    operation: state.user.operation,
});
const BookTablePage = connect(mapStateToProps, bindAction)(BookTablePageC);
export default BookTablePage;


const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 8,

    },
    buttonBlock: {
        marginTop: 'auto',
        marginBottom: 30,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    }
};