import React from 'react';
import {Image, StyleSheet, View, StatusBar} from 'react-native';
import SignStack, {signStackStyle} from "./routers/SignStack";
import {connect} from "react-redux";
import NavigationDrawer from "./routers/NavigationDrawer";
import {getRestaurants} from "./actions/restaurant";
import {Text, variables} from "native-base";
import Api from "./actions/api/api"
import TutorialPage from "./components/Tutorial/index";

/*EXPO*/

class App extends React.Component {

    props: {
        basket?: boolean
    };

    constructor(props) {
        super(props);

        variables.androidRipple = false;
    }

    componentWillMount() {

    }

    async loadPrefetch() {


        let restaurants = await this.props.getRestaurants();
        if (restaurants.restaurants) {
            Object.keys(restaurants.restaurants).forEach((item, i) => {
                //Image.prefetch(restaurants.restaurants[item].photos[0].url);
            });
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isLoading !== nextProps.isLoading) {
            this.loadPrefetch();
        }

        if (nextProps.user.token) {
            Api.jwt(nextProps.user.token);
        }
        else {
            Api.jwt(null);
        }
    }


    state = {
        lockMode: 'locked-closed'
    }

    render() {

        StatusBar.setBarStyle('light-content', true);
        if (this.props.isLoading) {
            return <View></View>
        }

        if (this.props.showTutorial) {
            return (
                <Image source={require('../assets/images/login&registration/login-bg.png')} style={signStackStyle}>
                    <TutorialPage/>
                </Image>
            )
        }

        if (this.props.showSign) {
            return (
                <Image source={require('../assets/images/login&registration/login-bg.png')} style={signStackStyle}>

                    <SignStack/>


                </Image>

            )
        }
        return (
            <Image source={require('../assets/images/background/background.png')} style={signStackStyle}>
                <NavigationDrawer style={{backgroundColor: '#000'}}
                                  onNavigationStateChange={(prevState, newState, action) => {

                                      /*let drawerEnable = newState.routes[0].routes.find((ele) => {
                                          return ele.index !== 0;
                                      });
                                      if (drawerEnable.index && drawerEnable.index >= 1) {
                                          this.setState({lockMode: 'locked-closed'});
                                      } else {
                                          this.setState({lockMode: 'unlocked'});
                                      }*/

                                  }}/>
            </Image>
        );
    }
}


function bindAction(dispatch) {
    return {
        getRestaurants: () => {
            return dispatch(getRestaurants());
        }
    };
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    restaurants: state.restaurant.restaurants,
    user: state.user,
    showSign: state.user.showSign,
    showTutorial: state.user.showTutorial
});
const Chester = connect(mapStateToProps, bindAction)(App);

export default Chester;

