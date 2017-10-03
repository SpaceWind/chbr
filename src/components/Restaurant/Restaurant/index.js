import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Picker, Right, Text, View} from 'native-base';
import {Image, TouchableOpacity, Dimensions, ScrollView} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";
import RestaurantLocation from "../common/RestaurantLocation/index";
import RestaurantContact from "../common/RestaurantContact/index";
import {connect} from "react-redux";
import ImageSlider from "react-native-image-slider";


class Restaurant extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.title
    });

    state = {
        position: 1,
        interval: null
    };

    componentWillMount() {
        this.setState({
            interval: setInterval(() => {
                this.setState({position: this.state.position === this.props.restaurants[this.props.navigation.state.params.key].photos.length - 1 ? 0 : this.state.position + 1});
            }, 5000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    static restaurantKey = null;

    render() {


        if (!this.props.navigation.state.params || !this.props.navigation.state.params.key) {

            this.props.navigation.state.params = {key: Restaurant.restaurantKey}
        }

        Restaurant.restaurantKey = this.props.navigation.state.params.key;
        let restaurant = this.props.restaurants[this.props.navigation.state.params.key];
        return (

            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>
                <ScrollView>
                    <View style={styles.container}>

                        <ImageSlider
                            images={
                                restaurant.photos.map((item) => item.url)
                            }
                            position={this.state.position}
                            onPositionChanged={position => this.setState({position})}
                            style={styles.image}
                        />


                        <View style={styles.infoBlock}>
                            <Text style={styles.infoHeader}>{restaurant.title_full}</Text>
                            <RestaurantLocation restaurant={restaurant}/>

                            <Text style={styles.infoText}>{restaurant.description}</Text>
                        </View>
                        <View style={styles.restaurantContact}>
                            <RestaurantContact restaurant={restaurant}/>
                        </View>
                    </View>
                </ScrollView>
            </Image>
        );
    }
}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants
});
const RestaurantSwag = connect(mapStateToProps, bindAction)(Restaurant);
export default RestaurantSwag;

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        maxWidth: Dimensions.get('window').width
    },
    image: {
        width: "100%"
    },
    infoBlock: {
        paddingHorizontal: 16,
        paddingBottom: 19,
        paddingRight: 30,
        paddingTop: 15
    },
    restaurantContact: {
        marginTop: 5
    },
    infoHeader: {
        color: platform.brandWarning,
        fontSize: 28,
        lineHeight: 40,
        marginTop: 14
    },
    infoText: {
        fontSize: 14,
        color: platform.brandFontAccent,
        lineHeight: 20,
        marginTop: 9
    }
}