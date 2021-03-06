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
import BuyByBonusPage from "../components/History/BuyByBonusPage/index";
import PayPage from "../components/Basket/PayPage/index";
import LunchPage from "../components/History/LunchPage/index";
import LoginTemplate from "./template/LoginTemplate";
import Common from "./template/Common";

import Profile from "../components/Profile/Profile";
import CardTemplate from "./template/CardTemplate";
import OneRestaurant from "./OneRestaurant";

export default RestaurantsStack = StackNavigator({
    Restaurants: {
        screen: Restaurants,
        navigationOptions: props => ({
            title: 'CHESTER',
            headerLeft: <DrawerIcon {...props} />
        })
    },
    OneRestaurant: {
        screen: OneRestaurant,
        navigationOptions: {
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
                color: "transparent",
                width: 0
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
            headerStyle: {
                ...BaseNavigationBarStyle.headerStyle,
                zIndex: 0
            }
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
    Pay: {
        screen: PayPage,
        navigationOptions: props => ({
            title: 'Оплата',
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
            drawerLockMode: 'locked-closed'
        }
    },
    RestaurantBuyByBonusHistory: {
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
            drawerLockMode: 'locked-closed'
        }
    },
    RestaurantLunchHistory: {
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
            drawerLockMode: 'locked-closed'
        }
    },
    Restaurant_Profile: {
        screen: Profile,
        navigationOptions: props => ({
            title: 'Регистрация',
            headerRight: <View></View>,
            headerBackTitleStyle: {
                color: "transparent"
            },
        }),
        drawerLockMode: 'locked-closed'
    },
	ScanBill: {
        screen: ScanBillPage,
        navigationOptions: {
            title: 'Сканирование чека',
            headerBackTitleStyle: {
                color: "transparent"
            },
			headerRight: <View></View>,
            drawerLockMode:'locked-closed'
        }
    },
    ...LoginTemplate,
    ...CardTemplate
}, {
    navigationOptions: props => ({
        ...BaseNavigationBarStyle,
        headerRight: <BasketIcon {...props} />
    }),
    cardStyle: {
        backgroundColor: 'transparent',
    }

});