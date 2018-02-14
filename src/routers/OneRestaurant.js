
import React from "react";
import RestaurantTabs from "./RestaurantTabs";
export const params = {
    restaurantId: null
};
export default class OneRestaurant extends React.Component {

    static router = RestaurantTabs.router;

    static navigationOptions = ({navigation, screenProps}) => {




        return {
            title: (navigation.state.params && navigation.state.params.title)? navigation.state.params.title:"Ресторан"
        }
    };


    render() {
        return <RestaurantTabs navigation={this.props.navigation}></RestaurantTabs>
    }
}