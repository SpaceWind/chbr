import React from 'react';
import {StackNavigator} from 'react-navigation';
import DrawerIcon from './components/DrawerIcon'
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";

import DiscountPage from "../components/Cards/DiscountPage/index";
import HowWorksPage from "../components/Common/HowWorksPage/index";

export default MyCardStack = StackNavigator({
    MayCardPage: {
        screen: DiscountPage,
        navigationOptions: props => ({
            title: 'Моя карта',
            headerLeft: <DrawerIcon {...props} />
        })
    },
    HowWorksPage: {
        screen: HowWorksPage,
        navigationOptions: props => ({
            title: 'Как это работает',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode:'locked-closed'
        })
    },
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});