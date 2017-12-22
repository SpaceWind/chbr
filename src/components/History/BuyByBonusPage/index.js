import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import HistoryShortInfo from "../common/HistoryShortInfo/index";

import historyStyles from "../common/historyStyle";

import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";
import {getOperation, getResultOperation} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import platform from "../../../../native-base-theme/variables/platform";

export class BuyByBonusPageC extends React.Component {

    state = {};

    constructor(props) {
        super(props);
        this.resultId = this.props.navigation.state.params.resultId;
    }

    componentWillMount() {
        this.props.getOperation(this.resultId);
        this.props.getResultOperation(this.resultId);
    }

    componentWillUnmount() {

    }


    render() {

        let operation = this.props.operation;
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

        console.log(operation);
        console.log(this.props.resultOperation);

        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <Spinner visible={this.props.isOperationPending || this.props.getResultOperationPending}
                         textStyle={{color: '#FFF'}}/>

                {operation && <View style={historyStyles.scrollContainer}>

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
                        <CategoryList  data={[dish]} basket={true}
                                      navigation={this.props.navigation}/></View>
                    }
                </View>}


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
}

function bindAction(dispatch) {
    return {
        getOperation: (operationId) => {
            dispatch(getOperation(operationId));
        },
        getResultOperation: (resultId) => {
            dispatch(getResultOperation(resultId));
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
        marginTop:15,
        height:82,
        borderColor: platform.brandDivider,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    }
};