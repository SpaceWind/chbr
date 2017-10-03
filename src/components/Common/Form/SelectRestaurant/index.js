/*@flow
* */
import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import MyModal from "../../../Common/MyModal/index";
import platform from "../../../../../native-base-theme/variables/platform";
import {Picker, TouchableOpacity} from "react-native";
import ChesterIcon from "../../ChesterIcon/index";

export default class SelectRestaurant extends React.Component {

    props: {
        onRestaurantSelected: () => {},
        restaurants: [],
        restaurant: string
    };

    state: {
        restaurant: string,
        isOpen: boolean
    };

    constructor(props) {
        super();
        this.state = {
            restaurant: props.restaurant,
            isOpen: false
        }
    }


    componentWillMount() {

    }


    getCurrentSelection() {

        if (this.props.restaurant === 'all') {
            return 'Все рестораны'
        }
        else {
            return this.props.restaurants.find((rest) => rest.id ===this.props.restaurant).title_short;
        }

    }

    selectRestaurant() {
        this.props.onRestaurantSelected({
            restaurant: this.state.restaurant
        });
        this.refs.modal.close()
    }


    setModalVisible(visible) {
        this.setState({isOpen: visible});
    }


    getRestaurants() {
        return [{
            id: "all",
            title_short: 'Все рестораны'
        }].concat(this.props.restaurants)
    }


    render() {
        return <View>
            <View>
                <TouchableOpacity onPress={() => {
                    this.setModalVisible(true)
                }}>
                    <View style={styles.selectDate}>
                        <ChesterIcon name="location-16" size={14}  color={'#fff'}  style={styles.selectDateIcon}/>
                        <Text style={styles.selectDateText}>{this.getCurrentSelection()}</Text>


                    </View>
                </TouchableOpacity>
            </View>

            <View>
                {this.state.isOpen &&
                <MyModal style={{height: 261, backgroundColor: "#2B3034"}} isOpen={this.state.isOpen} ref="modal"
                         position={'bottom'}
                         onRequestClose={() => {
                             this.setModalVisible(false)
                         }}>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                        paddingBottom: 10,
                        paddingTop: 6,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: platform.brandDivider
                    }}>


                        <TouchableOpacity
                            onPress={() => {
                                this.refs.modal.close();
                            }}
                        >
                            <Text style={{
                                color: platform.brandWarning,
                                fontSize: 20,
                                lineHeight: 29,
                                fontFamily: platform.fontFamily
                            }}>
                                Отмена
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectRestaurant();
                            }}
                        >
                            <Text style={{
                                color: platform.brandWarning,
                                fontFamily: platform.fontFamily,
                                fontSize: 20,
                                lineHeight: 29
                            }}>Готово</Text>
                        </TouchableOpacity>
                    </View>

                    <View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 17,

                        }}>
                            <Picker style={{flex: 1}}
                                    itemStyle={{fontFamily: platform.fontFamily, color: '#fff', textAlign: 'center'}}
                                    selectedValue={this.state.restaurant}
                                    onValueChange={(itemValue, itemIndex) => this.setState({
                                        restaurant: itemValue
                                    })}
                            >
                                {this.getRestaurants().map((item, i) => {
                                    return <Picker.Item key={i} label={item.title_short} value={item.id}/>
                                })}
                            </Picker>
                        </View>

                        <View
                            style={{
                                position: 'absolute',
                                top: 90,
                                left: 17,
                                right: 17,
                                height: 1,
                                backgroundColor: "#3B4248"
                            }}/>
                        <View
                            style={{
                                position: 'absolute',
                                top: 125,
                                left: 17,
                                right: 17,
                                height: 1,
                                backgroundColor: "#3B4248"
                            }}/>
                    </View>

                </MyModal>}
            </View>


        </View>
    }
}


const styles = {
    container: {
        flex: 1,

    },
    selectDate: {
        height: 36,
        marginHorizontal: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#4A545B',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectDateIcon: {
        paddingRight: 8

    },
    selectDateText: {
        fontFamily: platform.fontFamily,
        fontSize: 16,
        lineHeight: 23,
    },
};