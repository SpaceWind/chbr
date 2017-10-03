import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, ScrollView, TouchableOpacity, Dimensions, Platform} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";

import {addDish, initBasket, removeDish} from "../../../actions/billing";
import {connect} from "react-redux";
import LinearGradient from "react-native-linear-gradient";


export class DishC extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    constructor(props) {
        super(props);
        this.restaurantId = props.navigation.state.params.restaurantId;
        this.dish = props.navigation.state.params.dish;
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

    state = {
        like: false
    };

    like() {
        this.setState({like: !this.state.like});
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

            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

                <ScrollView>
                    <View style={styles.container}>
                        <View>

                            <Image source={{uri: dish.photos.main}} style={styles.image}>
                            </Image>
                            <LinearGradient
                                colors={['#000', 'transparent']}
                                start={{x:0.5, y:1}}
                                end={{x:0.5, y:0}}
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
                                <View style={styles.subInfoLikeBlock}>
                                    <Text style={styles.subInfoLike}>12</Text>
                                    <TouchableOpacity onPress={
                                        () => {
                                            this.like()
                                        }
                                    }>

                                        {

                                            this.state.like
                                                ?
                                                <ChesterIcon name="like-red-24" size={20} color={platform.brandDanger}
                                                />
                                                :
                                                <ChesterIcon name="like-24" size={20} color="#fff"/>

                                        }

                                    </TouchableOpacity>

                                </View>
                            </View>

                        </View>


                        <View style={styles.hang}>
                            {newDish && <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                                <ChesterIcon name="star-16" size={16} color={platform.brandWarning}/>
                                <Text style={styles.hangText}>Новое блюдо</Text>
                            </View>}
                            {hot && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <ChesterIcon name="chili-16" size={16} color={platform.brandWarning}/>
                                <Text style={styles.hangText}>Острое блюдо</Text>

                            </View>}
                        </View>


                        <View style={styles.contentBlock}>
                            <View>
                                <Text style={styles.header}>{dish.title}</Text>
                                <Text style={styles.text}>{dish.description}</Text>
                            </View>
                            <View style={styles.buttonBlock}>
                                <Button success rounded
                                        style={{width: '50%', marginRight: 13, justifyContent: 'center'}}>
                                    <Text uppercase={false}>За баллы</Text>
                                </Button>


                                {
                                    countDish === 0
                                        ?

                                        <Button warning rounded style={{flex: 1, justifyContent: 'center'}}
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
            </Image>
        );
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
        initBasket: (restaurantId) => {
            dispatch(initBasket(restaurantId));
        }
    };
}

const mapStateToProps = state => ({
    billing: state.billing
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