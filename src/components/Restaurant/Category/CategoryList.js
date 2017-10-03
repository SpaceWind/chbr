/*
 * @flow
 */
import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Right, Text, View} from 'native-base';
import {FlatList, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, Dimensions} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

import {signStackStyle} from "../../../routers/SignStack";
import RestaurantLocation from "../common/RestaurantLocation/index";
import RestaurantContact from "../common/RestaurantContact/index";
import CategoryListItem from "./CategoryListItem";
import moment from "moment";


export default class CategoryList extends React.Component {

    props: {
        basket?: boolean,
        data: [],
        onAddDish?: (dish) => void,
        onRemoveDish?: (dish) => void
    };
    state = {
        active: null,
    };

    componentWillMount() {
        for (let dish of  this.props.data) {
            dish.fadeAnim = new Animated.Value(0);
        }
    }

    reset() {
        if (this.state.active !== null) {
            Animated.timing(                  // Animate over time
                this.props.data.find((it) => it.id === this.state.active).fadeAnim,            // The animated value to drive
                {
                    toValue: 0,                   // Animate to opacity: 1 (opaque)
                    duration: 300,              // Make it take a while
                }
            ).start();


            this.setState({active: null})
        }
    }


    addItem(item) {
        this.setState((prevState, props) => {
                let obj = {
                    active: item.id
                };

                if (prevState.active !== obj.active || item.count === 0) {
                    Animated.timing(                  // Animate over time
                        item.fadeAnim,            // The animated value to drive
                        {
                            toValue: -50,                   // Animate to opacity: 1 (opaque)
                            duration: 300,              // Make it take a while
                        }
                    ).start();

                    if (prevState.active !== null && prevState.active !== obj.active) {
                        Animated.timing(                  // Animate over time
                            this.props.data.find((it) => it.id === prevState.active).fadeAnim,            // The animated value to drive
                            {
                                toValue: 0,                   // Animate to opacity: 1 (opaque)
                                duration: 300,              // Make it take a while
                            }
                        ).start();
                    }
                }
                else {

                }
                this.props.onAddDish(item);
                return obj;
            }
        );


    }

    minusItem(item) {
        if (item.count === 1) {
            Animated.timing(                  // Animate over time
                item.fadeAnim,            // The animated value to drive
                {
                    toValue: 0,                   // Animate to opacity: 1 (opaque)
                    duration: 300,              // Make it take a while
                }
            ).start();
        }
        this.props.onRemoveDish(item);

    }

    render() {


        return (
            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>
                <TouchableOpacity onPress={() => this.reset()} activeOpacity={1}>


                    <FlatList
                        data={this.props.data}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ItemSeparatorComponent={() => {
                            return <View style={styles.divider}>

                            </View>
                        }}

                    />


                </TouchableOpacity>
            </Image>
        );
    }

    _keyExtractor = (item, index) => item.id + item.count;

    _renderItem = ({item}) => {


        return (

            <CategoryListItem item={item}
                              navigation={this.props.navigation}
                              addItem={this.addItem.bind(this)}
                              minusItem={this.minusItem.bind(this)}
                              active={this.state.active}
                              basket={this.props.basket}
            />
        )

    };


    componentWillReceiveProps(nextProps) {

    }


}


const styles = {
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    divider: {
        borderColor: platform.brandDivider,
        borderBottomWidth: 1,
        width: '100%'
    }
}


export const fakeCategoryListArray = [
    {
        name: "Салат греческий",
        id: 12,
        weight: 280,
        price: 240,
        count: 2,

        photos: {},

        fadeAnim: new Animated.Value(0),
    }, {
        name: "Руккола с беконом",
        id: 14,
        weight: 320,
        count: 1,
        price: 340,
        photos: {},

        fadeAnim: new Animated.Value(0),
    },
    {
        name: "Салат из баклажанов",
        id: 16,
        weight: 280,
        price: 300,
        count: 2,
        photos: {},
        fadeAnim: new Animated.Value(0),
    }, {
        name: "Руккола с беконом",
        id: 133,
        weight: 320,
        count: 1,
        price: 340,
        photos: {},
        fadeAnim: new Animated.Value(0),
    },
    {
        name: "Салат из баклажанов",
        id: 13333,
        weight: 280,
        price: 300,
        count: 2,
        photos: {},
        fadeAnim: new Animated.Value(0),
    }
];