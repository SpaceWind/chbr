import React from 'react';
import {StackNavigator} from 'react-navigation';
import DrawerIcon from './components/DrawerIcon'
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";
import HistoryPage from "../components/History/HistoryPage";
import BookTablePage from "../components/History/BookTablePage/index";
import ScanBillPage from "../components/History/ScanBillPage/index";
import LunchPage from "../components/History/LunchPage/index";
import BuyByBonusPage from "../components/History/BuyByBonusPage/index";
import Common from "./template/Common";

export default ProfileStack = StackNavigator({
    Historys: {
        screen: HistoryPage,
        navigationOptions: props => ({
            title: 'История заказов',
            headerLeft: <DrawerIcon {...props} />

        })
    },
    BookTableHistory: {
        screen: BookTablePage,
        navigationOptions: {
            title: 'Бронирование стола',
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
            },
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle
            },
            drawerLockMode:'locked-closed'
        }
    },
    ScanBillHistory: {
        screen: ScanBillPage,
        navigationOptions: {
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
            },
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle
            },
            drawerLockMode:'locked-closed'
        }
    },
    LunchHistory: {
        screen: LunchPage,
        navigationOptions: {
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
            },
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle
            },
            drawerLockMode:'locked-closed'
        }
    },
    BuyByBonusHistory: {
        screen: BuyByBonusPage,
        navigationOptions: {
            title: 'Покупка за баллы',
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
            },
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle
            },
            drawerLockMode:'locked-closed'
        }
    },
    ...Common
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});