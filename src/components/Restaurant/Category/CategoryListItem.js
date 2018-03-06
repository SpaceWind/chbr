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
        basket?: boolean,
        noAnimate: boolean

    }


    constructor(props) {
        super(props);
    }


    shouldComponentUpdate(nextProps, nextState) {


        return nextProps.item.count !== this.props.item.count
            || nextProps.item.fadeAnim !== this.props.item.fadeAnim
            || nextProps.active !== this.props.active && this.props.item.id === this.props.active
            || nextProps.item.disabled !== this.props.item.disabled
    }

    render() {

        if (this.props.noAnimate) {

            return (
                <View>

                    {this._renderItem()}
                </View>
            )
        }

        return (
            <Animated.View style={{
                marginLeft: this.props.item.fadeAnim
            }}>

                {this._renderItem()}
            </Animated.View>
        )
    }

    _renderItem() {

        let imageStyles = getImagesStyles(this.props.basket ? 60 : 72);

        return <View style={{
            ...styles.menuItem,
            paddingVertical: this.props.basket ? 6 : 12
        }}>
            <View style={styles.info}>
                <TouchableOpacity style={styles.infoTouch} onPress={() => {

                    this.props.navigation.navigate({
                        routeName: 'Dish',
                        params: {name: this.props.item.title, dish: this.props.item},
                        key: "Dish"
                    })
                }} disabled={!this.props.navigation}>
                    <View style={styles.infoImageBlock}>

                        {this.props.item.photos && this.props.item.photos.thumb ?
                            <Image source={{uri: this.props.item.photos.thumb}} style={imageStyles.image}/>
                            :
                            <View style={imageStyles.defaultImageBlock}><Image
                                source={require('../../../../assets/images/menu/dish-icon.png')}
                                style={imageStyles.defaultImage}/></View>
                        }


                        {this.props.item.available_for_bonus === 1 && <View style={imageStyles.infoBonusBlock}>

                            <Text style={imageStyles.infoBonusText}>За баллы</Text>

                        </View>}


                        {this.props.item.disabled &&
                        <View style={imageStyles.lunchDisabledImage}>
                            <View style={imageStyles.lunchDisabledBlock}>
                                <Text style={imageStyles.lunchDisabledText}>!</Text>
                            </View>
                        </View>


                        }
                    </View>
                    <View style={styles.infoBlockText}>
                        <Text style={styles.infoText}>{this.props.item.title}</Text>
                        {!this.props.basket
                            ? <Text style={styles.weight}>{this.props.item.weight}</Text>
                            : this.props.item.disabled && <Text style={styles.disabledText}>Недоступно</Text>
                        }
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                {this.renderButton(this.props.item)}
            </View>
        </View>
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
        return (<Button bordered warning rounded
                        style={{...styles.addItemButton, ...(this.props.item.disabled ? styles.disabledButton : {})}}
                        disabled={!this.props.navigation}
                        onPress={() => {
                            this.props.navigation.navigate({
                                routeName: 'Dish',
                                params: {name: this.props.item.title, dish: this.props.item},
                                key: "Dish"
                            })
                        }}>
            <Text style={{...styles.addItemButtonText, ...(this.props.item.disabled ? styles.disabledButtonText : {})}}
                  uppercase={false}>{item.count + ' ' + 'X' + ' ' + item.price + " ₽"}</Text>
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


                bordered warning rounded style={styles.addItemButton} onPress={() => {
                this.props.addItem(item)
            }}>
                <Text style={styles.addItemButtonText} uppercase={false}>{item.price + " ₽"}</Text>
            </Button>        )

        }


    }

}


const getImagesStyles = (size) => {


    return {
        defaultImageBlock: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#7A8187',
            alignItems: 'center',
            justifyContent: 'center'
        },
        defaultImage: {
            width: 18,
            height: 38
        },

        infoImageBlock: {},


        image: {
            width: size,
            height: size,
            borderRadius: size / 2
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
        lunchDisabledImage: {
            height: size,
            width: size,
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: size / 2,
            overflow: 'hidden',
            backgroundColor: "rgba(0,0,0,0.5)"
        },
        lunchDisabledBlock: {
            height: 32,
            width: 32,
            position: "absolute",
            top: 14,
            left: 14,
            borderRadius: 16,
            backgroundColor: platform.brandDanger,
            overflow: 'hidden',
            alignItems: "center"
        },
        lunchDisabledText: {
            fontSize: 28,
            textAlign: "center"
        },
    }
}


const styles = {

    menuItem: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12
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
        paddingRight: 6

    },
    weight: {
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandWarning

    },
    disabledText: {
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },

    addItemButton: {
        height: 28,
        borderRadius: 8,
        paddingRight: 16.5,
        paddingLeft: 16.5,
        borderColor:platform.brandWarning

    },
    addItemButtonText: {
        fontSize: 14,
        color: platform.brandWarning
    },
    disabledButton: {
        borderColor: platform.brandOutline
    },
    disabledButtonText: {
        color: platform.brandOutline
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