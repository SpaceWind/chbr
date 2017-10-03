import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Right, Text, View} from 'native-base';
import {FlatList, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, Alert} from "react-native";
import {signStackStyle} from "../../../routers/SignStack";

import CategoryList from "./CategoryList";
import {connect} from "react-redux";
import {addDish, initBasket, removeDish} from "../../../actions/billing";


class Category extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });


    render() {

        let restaurant = this.props.navigation.state.params.restaurant;
        let id = this.props.navigation.state.params.id;
        let currentCategory = restaurant.menu.categories.find((item) => {
            if (item.categories) {
                return item.categories.find((category) => category.id === id);
            }
            return item.id === id;
        });

        this.restaurantId = restaurant.id;
        if (this.props.billing.restaurantId === restaurant.id) {

            for (let item of this.props.billing.dishes) {
                let dishInCategory = currentCategory.items.find(dish => dish.id === item.id);
                if (dishInCategory) {
                    dishInCategory.count = item.count;
                }
            }
        }
        else {
            for (let item of currentCategory.items) {
                item.count = 0;
            }
        }

        return (
            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

                <CategoryList data={Object.assign([], currentCategory.items)}
                              navigation={this.props.navigation}
                              onAddDish={this.addDish.bind(this)}
                              onRemoveDish={this.removeDish.bind(this)}
                />


            </Image>

        );
    }

    addDish(item) {


        if (this.props.billing.restaurantId !== this.restaurantId) {
            if (this.props.billing.restaurantId && this.props.billing.dishes.length > 0) {
                Alert.alert(
                    'Очистить корзину?',
                    'В корзине есть товары из другого ресторана, очистить корзину?',
                    [
                        {text: 'Нет', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'Да', onPress: () => {
                            this.props.initBasket(this.restaurantId);
                            this.props.addDish(item);
                        }
                        },
                    ]
                )
            }
            else {
                this.props.initBasket(this.restaurantId);
                this.props.addDish(item);
            }
        }
        else {
            this.props.addDish(item);
        }

    }


    removeDish(item) {
        this.props.removeDish(item);
    }
}

function bindAction(dispatch) {
    return {
        addDish: (dish) => {
            dispatch(addDish(dish));
        },
        removeDish: (dish) => {
            dispatch(removeDish(dish));
        },
        initBasket: (restaurantId) => {
            dispatch(initBasket(restaurantId));
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    billing: state.billing
});
const CategorySwag = connect(mapStateToProps, bindAction)(Category);
export default CategorySwag;
const styles = {};