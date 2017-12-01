/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import ChesterWithRedux from './src/setup'
import {AppRegistry} from "react-native";
import {View} from "native-base";
import cacheAssetsAsync from "./utilities/cacheAssetsAsync";
//import cacheAssetsAsync from "./utilities/cacheAssetsAsync";

require('moment/locale/ru');

export default class App extends React.Component {

    state = {
        appIsReady: true,
    };

    render() {

            return (
                <ChesterWithRedux/>
            );


    }

    componentWillMount() {
        this._loadAssetsAsync();
    }

    async _loadAssetsAsync() {
        try {
            await cacheAssetsAsync({
                images: [
                    require('./assets/images/login&registration/login-bg.png'),
                    require('./assets/images/login&registration/login-logo.png'),
                    require('./assets/images/login&registration/russia-flag.png'),
                    require('./assets/images/navigation/nav-bg.png'),
                    require('./assets/images/background/background.png'),
                    require('./assets/images/cafe-1.png'),
                    require('./assets/images/payment/mastercard.png'),
                    require('./assets/images/payment/visa.png'),
                    require('./assets/images/payment/apple.png'),
                    require('./assets/images/payment/credit-card.png'),
                    require('./assets/images/payment/credit-card-cvv.png'),
                    require('./assets/images/payment/credit-card-date.png'),
                    require('./assets/images/my_card/star.png'),
                ]
            });
        } catch (e) {
            console.warn(
                'There was an error caching assets (see: main.js), perhaps due to a ' +
                'network timeout, so we skipped caching. Reload the app to try again.'
            );
            console.log(e.message);
        } finally {
            this.setState({appIsReady: true});
        }
    }
}

AppRegistry.registerComponent('ChesterNative', () => App);
