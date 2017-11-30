import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import Amount from "../common/Amount/index";
import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";


export class BuyByBonusPageC extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};

    constructor(props) {
        super(props);
        this.history = this.props.navigation.state.params.history;
    }

    componentWillMount() {

    }

    componentWillUnmount() {

    }


    render() {


        let history = this.history;
        let restaurant = this.props.restaurants[history.restaurant_id];
        let restaurantName = "";
        if (restaurant) {
            restaurantName = restaurant.title_short;
        }


        let dish = null;

        if (restaurant) {
            dish = this.getDish(restaurant, history);
        }


        if (dish) {
            dish.count = 1;
        }


        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <View style={historyStyles.scrollContainer}>

                    <HistoryShortInfo info={history} result={history.result_data} restaurantName={restaurantName}/>

                    {dish && <CategoryList data={[dish]} basket={true} navigation={this.props.navigation}/>}
                </View>


            </ScrollView>
        </ImageBackground>)
    }

    getDish(restaurant, history) {
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
            }, []).find(dish => dish.id === history.result_data.id);
    }
}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants
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