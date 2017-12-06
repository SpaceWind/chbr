import React from 'react';
import {StackNavigator} from 'react-navigation';
import Restaurants from "../components/Restaurant/Restaurants";
import DrawerIcon from './components/DrawerIcon'
import {BaseNavigationBarStyle} from "./BaseNavigationBarStyle";
import RestaurantTabs from "./RestaurantTabs";
import Category from "../components/Restaurant/Category/index";
import Dish from "../components/Restaurant/Dish/index";
import BookTableConfirm from "../components/Restaurant/BookTableConfirm/index";
import BasketIcon from "./components/BasketIcon/index";
import BasketPage from "../components/Basket/BasketPage";
import OrderPage from "../components/Basket/OrderPage";
import CloseIcon from "./components/CloseIcon/index";
import {View} from "native-base";
import SignSecondStepSwag from "../components/SignIn/SignSecondStep/index";
import OneNewsPage from "../components/News/OneNewsPage/index";
import ScanBillPage from "../components/Cards/ScanBillPage/index";
import BookTablePage from "../components/History/BookTablePage/index";


export default RestaurantsStack = StackNavigator({
    Restaurants: {
        screen: Restaurants,
        navigationOptions: props => ({
            title: 'CHESTER',
            headerLeft: <DrawerIcon {...props} />
        })
    },
    OneRestaurant: {
        screen: RestaurantTabs,
        navigationOptions: {
            title: 'Ресторан',
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
                borderBottomWidth: 0,
                borderWidth: 0,
                zIndex: 0
            },
            drawerLockMode: 'locked-closed',
        }
    },
    Category: {
        screen: Category,
        navigationOptions: {
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle
            },
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle,
                marginHorizontal: 5,
                fontSize: 17
            },
            drawerLockMode: 'locked-closed',
        }
    },
    Dish: {
        screen: Dish,
        navigationOptions: {
            headerBackTitleStyle: {
                color: "transparent",
                width: 0
            },
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0,
                shadowRadius: 0
            },
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle,
                marginHorizontal: 5,
                fontSize: 17
            },
            drawerLockMode: 'locked-closed',
        }
    },
    BookTableConfirm: {
        screen: BookTableConfirm,
        navigationOptions: props => ({
            title: 'Подтверждение',
            headerBackTitleStyle: {
                color: "transparent"
            },

            headerLeft: <CloseIcon {...props} />,
            headerRight: <View></View>,
            headerStyle: BaseNavigationBarStyle.headerStyle,
            drawerLockMode: 'locked-closed'
        })
    },
    BookTableConfirmCode: {
        screen: SignSecondStepSwag,
        navigationOptions: props => ({
            title: 'Подтвердите телефон',
            headerBackTitleStyle: {
                color: "transparent"
            },

            headerLeft: <CloseIcon {...props} />,
            headerRight: <View></View>,
            headerStyle: BaseNavigationBarStyle.headerStyle,
            drawerLockMode: 'locked-closed',

        })
    },
    Basket: {
        screen: BasketPage,
        navigationOptions: props => ({
            title: 'Корзина',
            headerLeft: <CloseIcon {...props} />,
            headerRight: <View></View>,
            drawerLockMode: 'locked-closed',
        })
    },
    Order: {
        screen: OrderPage,
        navigationOptions: props => ({
            title: 'Оформление заказа',
            headerBackTitleStyle: {
                color: "transparent"
            },
            headerRight: <View></View>,
            headerTitleStyle: {
                ...BaseNavigationBarStyle.headerTitleStyle,
                marginHorizontal: 0
            },
            drawerLockMode: 'locked-closed',
        })
    },
    OneRestaurantNewsPage: {
        screen: OneNewsPage,
        navigationOptions: props => ({
            title: 'Новости и акции',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode: 'locked-closed'
        }),
    },
    ScanBill: {
        screen: ScanBillPage,
        navigationOptions: {
            title: 'Сканирование чека',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode:'locked-closed'
        }
    },
    RestaurantBookTableHistory: {
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
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle,
        headerRight: <BasketIcon {...props} />
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});