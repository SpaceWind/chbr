/*@flow*/


import React from "react";

import {TouchableOpacity, Animated, Image} from "react-native";
import {Button, Text, View, Icon} from 'native-base';
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
export default class CategoryListItem extends React.Component {


    props: {
        item: {
            fadeAnim: any,
            available_for_bonus: string,
            title: string,
            count: number,
            weight: string
        },
        navigation: any,
        active: string,
        addItem: () => void,
        minusItem: () => void;
        basket?:boolean

    }


    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.item.count !== this.props.item.count
            || nextProps.item.fadeAnim !== this.props.item.fadeAnim
            || nextProps.active !== this.props.active  && this.props.item.id === this.props.active
    }

    render() {
        return (
            <Animated.View style={{...styles.menuItem, marginLeft: this.props.item.fadeAnim}}>
                <View style={styles.info}>
                    <TouchableOpacity style={styles.infoTouch} onPress={() => {
                        this.props.navigation.navigate('Dish', {name: this.props.item.title, dish: this.props.item})
                    }}>
                        <View style={styles.infoImageBlock}>
                            <Image source={{uri: this.props.item.photos.thumb}} style={styles.image}/>
                            {this.props.item.available_for_bonus === 1 && <View style={styles.infoBonusBlock}>

                                <Text style={styles.infoBonusText}>За баллы</Text>

                            </View>}
                        </View>
                        <View style={styles.infoBlockText}>
                            <Text style={styles.infoText}>{this.props.item.title}</Text>
                            {!this.props.basket && <Text style={styles.weight}>{this.props.item.weight}</Text>}
                        </View>
                    </TouchableOpacity>
                </View>
                <View>

                    {this.renderButton(this.props.item)}
                </View>
            </Animated.View>
        )
    }

    renderButton(item) {
        if (this.props.basket) {
            return this.renderBasketButton(item);
        }
        else {
            return this.renderCategoryButton(item);
        }
    }

    renderBasketButton(item) {
        return (  <Button bordered warning rounded style={styles.addItemButton} onPress={() => {
            this.props.navigation.navigate('Dish', {name: item.title, dish: item})
        }}>
            <Text style={styles.addItemButtonText} uppercase={false}>{item.count + ' ' + 'X' + ' ' + item.price + " ₽"}</Text>
        </Button>        )
    }

    renderCategoryButton(item) {
        if (item.id === this.props.active && item.count > 0) {
            return (
                <View style={styles.changeCountItemButton}>
                    <Button dark bordered warning rounded style={styles.minusItemButton} onPress={() => {
                        this.props.minusItem(item)
                    }}>
                        <Icon name="remove" size={24}/>
                    </Button>

                    <View style={styles.counterItemButton}>
                        <Text style={styles.counterItemButtonText}> {item.count}</Text>
                    </View>

                    <View style={styles.plusItemButton}>
                        <Button androidRippleColor="rgba(0, 0, 0, 0.15)" bordered warning rounded
                                style={styles.plusItemButton} onPress={() => {
                            this.props.addItem(item)
                        }}>
                            <ChesterIcon name="plus-24" color={platform.brandWarning} size={16}/>
                        </Button>
                    </View>


                </View>
            )
        }
        else if (item.count > 0) {
            return (

                <View>

                    <Button
                        bordered warning rounded style={styles.addItemButton} onPress={() => {
                        this.props.addItem(item)
                    }}>


                        <Text style={styles.addItemButtonText} uppercase={false}>{item.price + " ₽"}</Text>
                    </Button>
                    <View style={styles.countItemBadgeBlock}>
                        <Text style={styles.countItemBadge}> {item.count}</Text>
                    </View>
                </View>

            )
        }
        else {
            return (  <Button
                disabled={true}

                bordered warning rounded style={styles.addItemButton} onPress={() => {
                this.props.addItem(item)
            }}>
                <Text style={styles.addItemButtonText} uppercase={false}>{item.price + " ₽"}</Text>
            </Button>        )

        }


    }

}


const styles = {

    menuItem: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 100,
    },
    info: {
        flexDirection: "row",
        flex: 1
    },
    infoTouch: {
        flexDirection: "row",
        alignItems: 'center',
        maxWidth: '100%'
    },
    infoBlockText: {
        marginLeft: 12,
        maxWidth: '100%',
        flex: 1
    },
    infoText: {
        fontFamily: platform.fontFamily,
        fontSize: 16,
        lineHeight: 18,
        maxWidth: '100%',

    },
    weight: {
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandWarning

    },
    infoImageBlock: {},
    image: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    infoBonusBlock: {
        position: 'absolute',
        bottom: 0,

        left: 6,
        overflow: 'hidden',
        height: 17,
        width: 57,
        borderWidth: 2,
        borderColor: '#2B3034',
        borderRadius: 100,
        backgroundColor: '#6FB423',
        justifyContent: 'center'
    },
    infoBonusText: {
        fontFamily: platform.fontFamily,
        fontSize: 10,
        textAlign: "center"
    },
    addItemButton: {
        height: 28,
        borderRadius: 8
    },
    addItemButtonText: {
        fontSize: 14,
        color: platform.brandWarning
    },
    changeCountItemButton: {
        flexDirection: 'row'
    },
    minusItemButton: {
        height: 34,
        width: 37,
        borderBottomLeftRadius: 34,
        borderTopLeftRadius: 34,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: "center"
    },
    plusItemButton: {
        height: 34,
        width: 37,
        borderBottomRightRadius: 34,
        borderTopRightRadius: 34,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: "center",
        overflow: 'hidden'
    },
    counterItemButton: {
        height: 34,
        width: 40,
        backgroundColor: platform.brandWarning,
        justifyContent: "center",
        alignItems: "center"
    },
    counterItemButtonText: {
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 26,
        textAlign: "center"

    },
    countItemBadgeBlock: {
        position: 'absolute',
        left: -9,
        top: -9,
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: platform.brandWarning,
        backgroundColor: "#2B3034",
        overflow: 'hidden',
        paddingRight: 2

    },
    countItemBadge: {
        fontFamily: platform.fontFamily,
        fontSize: 12,
        textAlign: "center",
        lineHeight: 17
    },
}