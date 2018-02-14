import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView, Alert} from "react-native";
import {Text, View, Icon, Button} from "native-base";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import historyStyles from "../common/historyStyle";
import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";
import {deleteOperation, getOperation, getResultOperation, getTableReserves} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import platform from "../../../../native-base-theme/variables/platform";
import {NavigationActions} from "react-navigation";

export class BuyByBonusPageC extends React.Component {

    state = {};

    constructor(props) {
        super(props);
        this.resultId = this.props.navigation.state.params.resultId;
        console.log('constructor')
    }

    componentWillMount() {
        this.props.getOperation(this.resultId);
        // this.props.getResultOperation(this.resultId);
    }

    componentWillUnmount() {

    }


    render() {

        let operation = this.props.operation;
        this.operation = operation;
        if (operation && operation.result_id !== this.resultId) {
            operation = null;
        }

        let restaurantName = '';
        let dish = null;
        if (operation) {
            let restaurant = this.props.restaurants[operation.restaurant_id];
            restaurantName = restaurant.title_short;
            if (restaurant) {
                dish = this.getDish(restaurant, operation);
            }
            if (dish) {
                dish.count = 1;
            }
        }


        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <Spinner visible={this.props.isOperationPending || this.state.loading}
                         textStyle={{color: '#FFF'}}/>

                {operation && <View style={historyStyles.minScrollContainer}>

                    <HistoryShortInfo info={operation} result={operation.result_data} restaurantName={restaurantName}/>

                    {<View style={styles.order}>
                        <Text style={styles.orderHeader}>Номер заказа:</Text>
                        <Text style={styles.orderValue}>{operation.result_data.order.serial_number}</Text>
                        <Text style={styles.orderHint}>
                            Назовите его администратору или официанту для получения заказа
                        </Text>
                    </View>}


                    {dish &&
                    <View style={styles.dish}>
                        <CategoryList data={[dish]} basket={true}
                                      navigation={this.props.navigation}/></View>
                    }


                    {(this.operation.status === 5 || this.operation.status === 6) && <View style={styles.buttonBlock}>

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


                }


            </ScrollView>
        </ImageBackground>)
    }

    getDish(restaurant, operation) {
        return restaurant.menu.categories
            .reduce((a, b) => {
                let items = [];
                if (b.categories) {
                    items = b.categories.reduce((a, subCategory) => {
                        return a.concat(subCategory.items);
                    }, [])
                } else {
                    items = b.items;
                }
                return a.concat(items);
            }, []).find(dish => dish.id === operation.result_data.food.id);
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
        getOperation: (operationId) => {
            dispatch(getOperation(operationId));
        },
        getResultOperation: (resultId) => {
            dispatch(getResultOperation(resultId));
        },
        getTableReserves: () => {
            return dispatch(getTableReserves());
        },
        deleteOperation: (id) => {
            return dispatch(deleteOperation(id));
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    isOperationPending: state.user.isOperationPending,
    getResultOperationPending: state.user.getResultOperationPending,
    resultOperation: state.user.resultOperation,
    operation: state.user.operation,
});
const BuyByBonusPage = connect(mapStateToProps, bindAction)(BuyByBonusPageC);
export default BuyByBonusPage;
console.log('connect')

const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    order: {
        paddingHorizontal: 16,
        marginTop: 12
    },
    orderHeader: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarningAccent
    },
    orderValue: {
        fontSize: 63,
        backgroundColor: 'transparent',
        marginTop: -10,
        marginBottom: -4
    },
    orderHint: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
    dish: {
        marginTop: 15,
        height: 82,
        borderColor: platform.brandDivider,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    buttonBlock: {
        marginTop: 'auto',
        marginBottom: 30,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    }
};