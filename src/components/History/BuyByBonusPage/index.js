import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import HistoryShortInfo from "../common/HistoryShortInfo/index";

import historyStyles from "../common/historyStyle";

import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";
import {getOperation} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";

export class BuyByBonusPageC extends React.Component {

    state = {};

    constructor(props) {
        super(props);
        this.resultId = this.props.navigation.state.params.resultId;
    }

    componentWillMount() {
        this.props.getOperation(this.resultId);
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


        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <Spinner visible={this.props.isOperationPending}
                         textStyle={{color: '#FFF'}}/>

                {operation && <View style={historyStyles.scrollContainer}>

                    <HistoryShortInfo info={operation} result={operation.result_data} restaurantName={restaurantName}/>

                    {dish && <CategoryList data={[dish]} basket={true} navigation={this.props.navigation}/>}
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
            }, []).find(dish => dish.id === operation.result_data.id);
    }
}

function bindAction(dispatch) {
    return {
        getOperation: (operationId) => {
            dispatch(getOperation(operationId));
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    isOperationPending: state.user.isOperationPending,
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
    }
};