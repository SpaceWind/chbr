/*
 * @flow
 */
import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Right, Text, View} from 'native-base';
import {
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

import {signStackStyle} from "../../../routers/SignStack";
import Swipeout from "react-native-swipeout";
import CategoryListItem from "../../Restaurant/Category/CategoryListItem";


export default class BasketList extends React.Component {

    props: {
        data: [],
        onDeleteDish?: (dish) => void
    };
    state = {
        active: null,
    };

    componentWillMount() {
        for (let dish of  this.props.data) {
            dish.fadeAnim = 0;
        }
    }


    render() {


        return (
            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>


                {(this.props.data && this.props.data.length > 0 || this.props.basket) ?

                    <View style={styles.flatList}>
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
                    </View>
                    : <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    width: null,
                    height: null,
                }}>
                    <Text style={{
                        fontSize: 22,
                        lineHeight: 33,
                        textAlign: 'center'
                    }}> В данный момент нет доступных для заказа блюд</Text>

                </View>}


            </ImageBackground>
        );
    }

    _keyExtractor = (item, index) => item.id + item.count;

    _renderItem = ({item}) => {


        let swipeoutBtns = [
            {
                onPress: () => {

                },
                component: (<Button danger style={styles.swipeButton}
                                    onPress={() => {
                                        this.props.onDeleteDish(item);
                                    }}
                >
                    <Text style={styles.swipeButtonText} uppercase={false}>Удалить</Text>
                </Button>),
                underlayColor: '#9b4f47'
            }
        ];

        return (
            <Swipeout backgroundColor={'#2B3034'}
                      right={swipeoutBtns}
                      buttonWidth={88}
                      autoClose={true}
                      scroll={() => false}>
                <CategoryListItem item={item}
                                  navigation={this.props.navigation}
                                  active={this.state.active}
                                  basket={true}
                                  noAnimate={true}
                />
            </Swipeout>

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
    },
    swipeButton: {
        width: 88,
        borderRadius: 0,
        height: '100%',
        padding: 16,
        justifyContent: 'center'
    },
    swipeButtonText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: '#fff'
    },
    flatList:{
        borderColor: platform.brandDivider,
        borderBottomWidth: 1,

    }
}

