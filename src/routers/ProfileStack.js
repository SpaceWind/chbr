import React from 'react';
import {StackNavigator} from 'react-navigation';
import Profile from "../components/Profile/Profile";
import AddCard from "../components/Profile/AddCard";
import DrawerIcon from './components/DrawerIcon'
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";
import CardTemplate from "./template/CardTemplate";
import Common from "./template/Common";

export default ProfileStack = StackNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: props => ({
            title: 'Ваш профиль',
            headerLeft: <DrawerIcon {...props} />

        })
    },
    AddCard: {
        screen: AddCard,
        navigationOptions: props => ({
            title: 'Добавление карты',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode: 'locked-closed'
        })
    },
    ...CardTemplate,
    ...Common
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});