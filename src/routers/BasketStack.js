import React from 'react';
import {StackNavigator} from 'react-navigation';
import BasketPage from "../components/Basket/BasketPage";
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";
import CloseIcon from "./components/CloseIcon/index";

export default BasketStack = StackNavigator({
    Basket: {
        screen: BasketPage,
        navigationOptions: props => ({
            title: 'Корзина',
            headerLeft: <CloseIcon {...props} />
        })
    }
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle,
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});