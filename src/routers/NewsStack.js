import React from 'react';
import {StackNavigator} from 'react-navigation';
import Profile from "../components/Profile/Profile";
import AddCard from "../components/Profile/AddCard";
import DrawerIcon from './components/DrawerIcon'
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";

import BasketIcon from "./components/BasketIcon/index";
import AllNews from "../components/News/AllNews/index";
import OneNewsPage from "../components/News/OneNewsPage/index";

export default NewsStack = StackNavigator({
    News: {
        screen: AllNews,
        navigationOptions: props => ({
            title: 'Новости и акции',
            headerLeft: <DrawerIcon {...props} />
        })
    },
    OneNewsPage: {
        screen: OneNewsPage,
        navigationOptions: props => ({
            title: 'Новости и акции',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode:'locked-closed'
        })
    }
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});