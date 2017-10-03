import React from 'react';
import {StackNavigator} from 'react-navigation';
import DrawerIcon from './components/DrawerIcon'
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";

import FeedBackPage from "../components/FeedBack/FeedBackPage/index";

export default FeedBackStack = StackNavigator({
    FeedBack: {
        screen: FeedBackPage,
        navigationOptions: props => ({
            title: 'Обратная связь',
            headerLeft: <DrawerIcon {...props} />
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