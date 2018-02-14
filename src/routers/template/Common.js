import React from 'react';
import Profile from "../../components/Profile/Profile";
import DrawerIcon from './../components/DrawerIcon'

import DiscountPage from "../../components/Cards/DiscountPage/index";
import HowWorksPage from "../../components/Common/HowWorksPage/index";
import ScanBillPage from "../../components/Cards/ScanBillPage/index";


export default Common = {
    ScanBill: {
        screen: ScanBillPage,
        navigationOptions: {
            title: 'Сканирование чека',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode:'locked-closed'
        }
    }
}