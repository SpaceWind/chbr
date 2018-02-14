import React from 'react';
import platform from "../../../native-base-theme/variables/platform";
import {StackNavigator} from "react-navigation";
import SignFirstStep from "../../components/SignIn/SignFirstStep/index";
import SignSecondStep from "../../components/SignIn/SignSecondStep/index";

import CloseIcon from "../components/CloseIcon/index";
import {View} from "native-base";
export default LoginTemplate = {
    Login: {
        screen:  StackNavigator({
            SignFirst: {
                screen: SignFirstStep,
                navigationOptions: props => ({
                    title: "Вход",
                    headerLeft: <CloseIcon {...props} />,
                    lockMode: 'locked-closed'
                })
            },
            SignSecond: {
                screen: SignSecondStep,
                navigationOptions: props => ({
                    title: "Подтверждение",
                    headerLeft: <CloseIcon {...props} />
                })
            },
        }, {
            cardStyle: {
                backgroundColor: 'transparent',
            },
            navigationOptions: {
                headerTitleStyle: {
                    fontSize: 24,
                    fontFamily: platform.fontFamily
                },
                headerStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    zIndex: 100,
                    top: 0,
                    left: 0,
                    right: 0,
                    borderBottomWidth: 0,
                    overflow:'hidden',
                    height:0
                },

                headerTintColor: 'transparent'
            }
        }),
        navigationOptions: {
            headerRight: <View></View>,
            drawerLockMode: 'locked-closed',
        },

    }
}


