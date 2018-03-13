import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Right, Text, View} from 'native-base';
import {
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Alert
} from "react-native";
import {signStackStyle} from "../../../routers/SignStack";

import CategoryList from "./CategoryList";
import {connect} from "react-redux";
import {addDish, initBasket, removeDish} from "../../../actions/billing";
import OnlyRestobarChester from "../common/OnlyRestobarChester/index";
import DenyOrder from "../common/DenyOrder/index";


class Category extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });


    state = {
        isOpen: false,
        isOpenOver: false
    }


    render() {

        let restaurant = this.props.navigation.state.params.restaurant;
        let id = this.props.navigation.state.params.id;
        let currentCategory = restaurant.menu.categories.find((item) => {
            if (item.categories) {
                return item.categories.find((category) => category.id === id);
            }
            return item.id === id;
        });

        if (!currentCategory.items) {
            currentCategory = currentCategory.categories.find((category) => category.id === id);
        }


        let items = currentCategory.items.filter(item => item.status === 1);
        this.restaurantId = restaurant.id;
        items.sort((a, b) => {
            return a.sort - b.sort;
        });
        for (let item of items) {
            item.count = 0;
        }
        if (this.props.billing.restaurantId === restaurant.id) {

            for (let item of this.props.billing.dishes) {
                let dishInCategory = items.find(dish => dish.id === item.id);
                if (dishInCategory) {
                    dishInCategory.count = item.count;
                }
            }
        }


        return (
            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>

                <CategoryList data={Object.assign([], items)}
                              navigation={this.props.navigation}
                              onAddDish={this.addDish.bind(this)}
                              onRemoveDish={this.removeDish.bind(this)}
                />

                <OnlyRestobarChester isOpen={this.state.isOpen} restaurantName={restaurant.title_short} onClose={() => {
                    this.setState({isOpen: false})
                }}/>
                <DenyOrder isOpen={this.state.isOpenOver}  onClose={() => {
                    this.setState({isOpenOver: false})
                }}/>


            </ImageBackground>

        );
    }

    addDish(item) {

        if (this.restaurantId === "1070b543-5104-4191-9a42-cbf1e9a1e9f9") {
            if (!item.available) {
                this.setState({isOpenOver: true});
                return false;
            }

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
            return true;
        }
        else {
            this.setState({isOpen: true});
            return false;
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