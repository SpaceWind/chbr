import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {
    Image,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator
} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";

import {addDish, initBasket, removeDish} from "../../../actions/billing";
import {connect} from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import {Alert} from "react-native";
import {buyByBonus, getDish, getRestaurants, likeDish} from "../../../actions/restaurant";
import Spinner from "react-native-loading-spinner-overlay";
import {getLikes} from "../../../actions/user";


export class DishC extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {
        like: false,
        loading: false,
        likes: 0,
        current_client_like_it: false
    };

    componentWillMount() {
        this.props.getDish(this.restaurantId, this.dish.category_id, this.dish.id);
    }

    constructor(props) {
        super(props);
        this.dish = props.navigation.state.params.dish;
        this.restaurantId = props.navigation.state.params.dish.restaurant_id;
        this.state.likes = this.dish.likes;
        this.state.current_client_like_it = this.dish.current_client_like_it;
    }

    render() {
        let dish = this.dish;
        this.restaurantId = dish.restaurant_id;

        let enabled = Object.keys(dish.badges).map((key) => {
            return dish.badges[key]
        }).filter(item => item.status).map(item => item.title.toLowerCase());

        let hot = enabled.find(item => item === 'острое');
        let newDish = enabled.find(item => item === 'новое блюдо');

        let savedDish = this.props.billing.dishes.find(item => item.id === dish.id);
        let countDish = 0;
        if (savedDish) {
            countDish = savedDish.count;
        }


        return (


            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>
                <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>
                <ScrollView>
                    <View style={styles.container}>
                        <View>

                            <Image source={{uri: dish.photos.main}} style={styles.image}>
                            </Image>
                            <LinearGradient
                                colors={['#000', 'transparent']}
                                start={{x: 0.5, y: 1}}
                                end={{x: 0.5, y: 0}}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 75,
                                }}
                            >


                            </LinearGradient>

                            <View
                                style={styles.subInfo}
                            >

                                <Text style={styles.subInfoWeight}>
                                    {dish.weight}
                                </Text>

                                {

                                    this.props.currentDishPending || this.props.likePending ?
                                        <ActivityIndicator

                                        /> :
                                        <View style={styles.subInfoLikeBlock}>


                                            <Text
                                                style={styles.subInfoLike}>{this.props.currentDishPending || !this.props.currentDish ? '' : this.props.currentDish.likes}</Text>


                                            <TouchableOpacity

                                                onPress={
                                                    () => {
                                                        this.like()
                                                    }
                                                }>


                                                {this.props.currentDish && (

                                                    this.props.currentDish.current_client_like_it
                                                        ?
                                                        <ChesterIcon name="like-red-24" size={20}
                                                                     color={platform.brandDanger}
                                                        />
                                                        :
                                                        <ChesterIcon name="like-24" size={20} color="#fff"/>)

                                                }

                                            </TouchableOpacity>

                                        </View>


                                }


                            </View>

                        </View>


                        {(hot || newDish) && <View style={styles.hang}>
                            {newDish && <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                                <ChesterIcon name="star-16" size={16} color={platform.brandWarning}/>
                                <Text style={styles.hangText}>Новое блюдо</Text>
                            </View>}
                            {hot && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <ChesterIcon name="chili-16" size={16} color={platform.brandWarning}/>
                                <Text style={styles.hangText}>Острое блюдо</Text>

                            </View>}
                        </View>}


                        <View style={styles.contentBlock}>
                            <View>
                                <Text style={styles.header}>{dish.title}</Text>
                                <Text style={styles.text}>{dish.description}</Text>
                            </View>
                            <View style={styles.buttonBlock}>
                                {this.dish.available_for_bonus === 1 && <Button
                                    success rounded
                                    onPress={() => {
                                        this.buyByBonusCallback()
                                    }}
                                    style={{
                                        width: '50%',
                                        marginRight: 13,
                                        justifyContent: 'center'
                                    }}>
                                    <Text uppercase={false}>За баллы</Text>
                                </Button>}


                                {
                                    countDish === 0
                                        ?

                                        <Button
                                            disabled={true}
                                            warning rounded style={{flex: 1, justifyContent: 'center'}}
                                            onPress={() => {
                                                this.addItem()
                                            }}>
                                            <Text uppercase={false}>{dish.price + ' ₽'}</Text>
                                        </Button>

                                        :
                                        <View style={styles.changeCountItemButton}>
                                            <Button dark bordered warning rounded style={styles.minusItemButton}
                                                    onPress={() => {
                                                        this.minusItem()
                                                    }}>
                                                <Icon name="remove" size={24}/>
                                            </Button>

                                            <TouchableOpacity style={styles.counterItemButton}
                                                              androidRippleColor="rgba(0, 0, 0, 0.15)" onPress={() => {
                                                this.addItem()
                                            }}>
                                                <Text
                                                    style={styles.counterItemButtonText}> {countDish}</Text>
                                            </TouchableOpacity>

                                            <View style={styles.plusItemButton}>
                                                <Button androidRippleColor="rgba(0, 0, 0, 0.15)" bordered warning
                                                        rounded
                                                        style={styles.plusItemButton} onPress={() => {
                                                    this.addItem()
                                                }}>
                                                    <ChesterIcon name="plus-24" color={platform.brandWarning}
                                                                 size={16}/>
                                                </Button>
                                            </View>


                                        </View>


                                }


                            </View>
                        </View>


                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }


    addItem(item) {
        if (this.props.billing.restaurantId !== this.restaurantId) {
            this.props.initBasket(this.restaurantId);
        }
        this.props.addDish(this.dish);
    }

    minusItem(item) {
        this.props.removeDish(this.dish);
    }


    async like() {

        let like = !this.props.currentDish.current_client_like_it;
        await this.props.likeDish(this.restaurantId, this.dish.category_id, this.dish.id, like);

        this.props.getDish(this.restaurantId, this.dish.category_id, this.dish.id);
    }

    buyByBonusCallback() {

        if (this.props.logged) {
            Alert.alert(
                'Вы уверены?',
                `С вашего счета будет списано ${this.dish.price} баллов`,
                [
                    {text: 'Нет', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {
                        text: 'Да', onPress: () => {
                        this.buyByBonus();

                    }
                    },
                ]
            )
        }
        else {
            Alert.alert(
                'Вы не авторизованы',
                `Выполните вход`,
                [
                    {text: 'ОК', onPress: () => console.log('Cancel Pressed')}
                ]
            )
        }


    }

    async buyByBonus() {
        this.setState({loading: true});
        try {
            let res = await this.props.buyByBonus(this.restaurantId, this.dish.id);
            this.setState({loading: false});
            setTimeout(() => {
                Alert.alert(
                    'Успешно',
                    'Вы приобрели блюдо за баллы. Обратитесь к ****.',
                    [

                        {
                            text: 'Ок', onPress: () => {
                        }
                        }
                    ]
                )
            }, 10);
        }
        catch (err) {

            let status = err.status;
            this.setState({loading: false});
            switch (status) {
                case 404: {
                    setTimeout(() => {
                        Alert.alert(
                            'Ошибка',
                            'Товар не найден. попробуйте позже.',
                            [

                                {
                                    text: 'Ок', onPress: () => {

                                }
                                }
                            ]
                        )
                    }, 10);
                    break;
                }
                case 422: {
                    setTimeout(() => {
                        Alert.alert(
                            'Ошибка',
                            'Вам не хватает баллов для покупки.',
                            [

                                {
                                    text: 'Ок', onPress: () => {
                                }
                                }
                            ]
                        )
                    }, 10);
                    break;
                }
            }

        }
    }


}

function bindAction(dispatch) {
    return {
        addDish: (dish) => {
            dispatch(addDish(dish));
        },
        removeDish: (dish) => {
            dispatch(removeDish(dish));
        },
        buyByBonus: (restaurantId, dishId) => {
            return dispatch(buyByBonus(restaurantId, dishId));
        },
        initBasket: (restaurantId) => {
            dispatch(initBasket(restaurantId));
        },
        likeDish: (restaurantId, categoryId, dishId, like) => {
            return dispatch(likeDish(restaurantId, categoryId, dishId, like));
        },
        getRestaurants: () => {
            return dispatch(getRestaurants());
        },
        getDish: (restaurantId, categoryId, dishId) => {
            return dispatch(getDish(restaurantId, categoryId, dishId));
        }
    };
}

const mapStateToProps = state => ({
    billing: state.billing,
    logged: state.user.logged,
    restaurants: state.restaurant.restaurants,
    likes: state.user.likes,
    currentDishPending: state.restaurant.currentDishPending,
    currentDish: state.restaurant.currentDish,
    likePending: state.restaurant.likePending
});

const Dish = connect(mapStateToProps, bindAction)(DishC);
export default Dish;

const styles = {
    container: {
        flex: 1,
        minHeight: Dimensions.get('window').height -
        (Platform.OS === "ios" ? 64 : (56 /*+ 30/*Constants.statusBarHeight*/)),
    },
    image: {
        height: 260,
        width: null
    },
    subInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 11
    },
    subInfoWeight: {
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29
    },
    subInfoLikeBlock: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    subInfoLike: {
        paddingRight: 5,
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29
    },
    hang: {

        borderBottomWidth: 1,
        borderColor: platform.brandDivider,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    hangText: {
        color: platform.brandFontAccent,
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20,
        paddingLeft: 3
    },
    contentBlock: {
        paddingHorizontal: 16,
        flex: 1,
    },
    buttonBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: 10,
        paddingBottom: 30
    },
    header: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 28,
        lineHeight: 40
    },
    text: {
        color: platform.brandFontAccent,
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20
    },
    changeCountItemButton: {
        flexDirection: 'row',
        flex: 1
    },
    minusItemButton: {
        borderBottomLeftRadius: 34,
        borderTopLeftRadius: 34,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: "center",
        flex: 1
    },
    plusItemButton: {
        marginLeft: -1,
        borderBottomRightRadius: 34,
        borderTopRightRadius: 34,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: "center",
        flex: 1
    },
    counterItemButton: {
        borderWidth: 0,
        backgroundColor: platform.brandWarning,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    counterItemButtonText: {
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 26,
        textAlign: "center",
    },

};