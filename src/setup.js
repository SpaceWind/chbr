import React, {Component} from 'react';
import {Provider} from 'react-redux';

import {StyleProvider} from 'native-base';
import Chester from './Chester';
import configureStore from './configureStore';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform'
import * as moment from "moment";
//import {AppLoading} from "expo";



export default class ChesterWithRedux extends Component {

    constructor() {
        super();
        moment.locale('ru');
        this.state = {
            isLoading: true,
            store: configureStore(() => {
                this.setState({isLoading: false});
            }),
        };
    }


    render() {


            return (
                <StyleProvider style={getTheme(platform)}>
                    <Provider store={this.state.store}>
                        <Chester isLoading={this.state.isLoading}/>
                    </Provider>
                </StyleProvider>

            );



    }
}

