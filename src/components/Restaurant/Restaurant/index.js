import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Picker, Right, Text, View} from 'native-base';
import {Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";
import RestaurantLocation from "../common/RestaurantLocation/index";
import RestaurantContact from "../common/RestaurantContact/index";
import {connect} from "react-redux";
import ImageSlider from "react-native-image-slider";
import Swiper from 'react-native-swiper';


export const params = {
    restaurantId: null
};
const {width} = Dimensions.get('window')

export class Restaurant extends React.Component {
    /*static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.title
    });*/

    state = {
        position: 0,
        interval: null,
        visibleSwiper: false
    };

    restaurantId = null;

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                visibleSwiper: true
            });
        }, 100);
    }

    componentWillMount() {
        /*this.setState({
            interval: setInterval(() => {
                this.setState({position: this.state.position === this.props.restaurants[this.props.navigation.state.params.key].photos.length - 1 ? 0 : this.state.position + 1});
            }, 5000)
        });*/
    }

    componentWillUnmount() {
        /*clearInterval(this.state.interval);*/
    }

    render() {
        if (!this.props.navigation.state.params || !this.props.navigation.state.params.key) {
            this.restaurantId = params.restaurantId;
        }
        else {
            this.restaurantId = this.props.navigation.state.params.key;
        }
        params.restaurantId = this.restaurantId;
        let restaurant = this.props.restaurants[this.restaurantId];
        return (

            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>
                <ScrollView ref='scroll'>
                    <View style={styles.container}>


                        <View style={{height: 200}}>
                            {  this.state.visibleSwiper && <Swiper style={styles.wrapper}
                                    loop={false}
                                    index={0}
                                    dotColor={'rgba(255,255,255,0.3)'}
                                    activeDotColor={'#fff'}
                                    ref='swiper'
                                    loadMinimal loadMinimalSize={2}
                                    onIndexChanged={(i) => {
                                        this.index = i;
                                    }}
                            >


                                {
                                    restaurant.photos.map((item) => item.url).map((item, i) => <Slide
                                        loadHandle={(i) => {
                                            this._loadHandle(i)
                                        }}
                                        loaded={!!this.state['loadQueue' + i]}
                                        uri={item}
                                        i={i}
                                        key={i}/>)
                                }


                            </Swiper>}</View>


                        <View style={styles.infoBlock}>
                            <Text style={styles.infoHeader}>{restaurant.title_full}</Text>
                            <RestaurantLocation restaurant={restaurant}/>

                            <Text style={styles.infoText}>{restaurant.description}</Text>
                        </View>
                        <View style={styles.restaurantContact}>
                            <RestaurantContact restaurant={restaurant} onOpen={() => {

                                setTimeout(() => {
                                    this.refs.scroll.scrollToEnd();
                                }, 60)
                            }}/>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }

    _loadHandle(i) {
        let state = {};
        state['loadQueue' + i] = true;
        this.setState(state)
    }

}


const Slide = props => {
    return (<View style={styles.slide}>
        <Image onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={{uri: props.uri}}/>
        {
            !props.loaded && <View style={styles.loadingView}>
                <ActivityIndicator


                />
            </View>
        }
    </View>)
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
    wrapper: {},
    slide: {
        width,
        height:200,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.3)'
    },
    image: {
        width,
        backgroundColor: 'transparent',
        height: 200
    },

    infoBlock: {
        paddingHorizontal: 16,
        paddingBottom: 19,
        paddingRight: 30
    },
    restaurantContact: {
        marginTop: 5,
        paddingBottom: 100
    },
    infoHeader: {
        color: platform.brandWarning,
        fontSize: 28,
        lineHeight: 40,
        marginTop: 10
    },
    infoText: {
        fontSize: 14,
        color: platform.brandFontAccent,
        lineHeight: 20,
        marginTop: 9
    }
}