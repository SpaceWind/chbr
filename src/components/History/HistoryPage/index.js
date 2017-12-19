import React from 'react';
import {connect} from "react-redux";

import {FlatList, Image, ImageBackground, RefreshControl, ScrollView, TouchableOpacity, Alert} from "react-native";
import moment from "moment";
import {Text, View, Icon, Button} from "native-base";
import Swipeout from "react-native-swipeout";
import platform from "../../../../native-base-theme/variables/platform";
import {signStackStyle} from "../../../routers/SignStack";
import {deleteOperation, getTableReserves} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";

class HistoryPage extends React.Component {


    state = {
        opened: null
    };

    componentWillMount() {
        this.props.getTableReserves()
    }

    componentWillUnmount() {

    }

    openHistory(item, title) {

        switch (item.type) {
            case 2: {
                this.props.navigation.navigate('ScanBillHistory', {name: title, history: item});
                break;
            }
            case 3: {
                this.props.navigation.navigate('BookTableHistory', {
                    name: title,
                    history: item,
                    reserveId: item.result_id
                });
                break;
            }
            case 4: {
                this.props.navigation.navigate('TakeAwayOrderHistory', {name: title, history: item});
                break;
            }
            case 5: {
                this.props.navigation.navigate('BuyByBonusHistory', {name: title, resultId: item.result_id});
                break;
            }
            case 7: {
                this.props.navigation.navigate('LunchHistory', {name: title, history: item});
                break;
            }
        }
    }


    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => {


        let title = '';
        switch (item.type) {
            case 0: {
                title = "Бронирование стола";
                break;
            }
            case 2: {
                title = "Сканирование чека";
                break;
            }
            case 3: {
                title = "Бронирование стола";
                break;
            }
            case 4: {
                title = "Заказ на вынос";
                break;
            }
            case 5: {
                title = "Покупка за баллы";
                break;
            }
            case 7: {
                title = "Ланч в ресторане";
                break;
            }
        }

        let swipeoutBtns = [
            {
                onPress: () => {

                },
                component: (<Button danger style={styles.swipeButton}
                                    onPress={() => {
                                        this._deleteOperation(item.id);
                                    }}
                >
                    <Text style={styles.swipeButtonText} uppercase={false}>Удалить</Text>
                </Button>),
                underlayColor: '#9b4f47'
            }
        ];

        let bonus = item.type === 4 ? -item.bonus : item.bonus;
        let bonusText = bonus + ' ' + 'бал.';


        let date = moment.utc(item.created_at).local();
        if (item.type === 3) {
            bonusText = item.result_data.people_quantity + ' чел.';
            date = moment.utc(item.result_data.timestamp);
        }


        let restaurant = this.props.restaurants[item.restaurant_id];

        let restaurantName = '';
        if (restaurant) {
            restaurantName = restaurant.title_short;
        }


        return (

            <Swipeout backgroundColor={'#2B3034'}
                      right={swipeoutBtns}

                      buttonWidth={88}

                      autoClose={true}
                      scroll={() => false}>
                <TouchableOpacity style={styles.listItemTouch} onPress={() => {
                    this.openHistory(item, title)
                }}>
                    <View style={styles.listItem}>

                        <View style={styles.listItemBody}>
                            <Text style={styles.listItemHeader}>{title}</Text>
                            <View style={styles.listItemPointBlock}>
                                <Text
                                    style={styles.listItemPointText}>{date.format('D MMM, HH:mm')}</Text>
                                {item.type !== 5 && item.type !== 3 && <View style={styles.listItemPriceBlock}>
                                    <View style={styles.infoPoint}/>
                                    <Text style={styles.listItemPointText}>{(item.price || item.summ) + ' ₽'}</Text>
                                </View>}
                                <View style={styles.infoPoint}/>
                                <Text style={styles.listItemPointText}>{bonusText}</Text>
                            </View>
                            <Text style={styles.listItemRestaurant}>{restaurantName}</Text>
                        </View>
                        <Icon style={styles.listItemIcon} name="arrow-forward"/>
                    </View>
                </TouchableOpacity>
            </Swipeout>

        )
    };


    capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    render() {


        let empty = !this.props.history || !this.props.history.list || this.props.history.list.length === 0;


        let list = [];
        if (!empty) {
            list = this.props.history.list.filter((item) => {
                return item.type !== 6 && item.type !== 8 && item.type !== 9 && item.type !== 10;
            });
            if (list.length === 0) {
                empty = true;
            }
        }


        return <ImageBackground source={require('../../../../assets/images/background/background.png')}
                                style={signStackStyle}>

            <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>
            {!empty || this.props.isPending
                ? <FlatList
                    style={styles.list}
                    data={list}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.isPending}
                            onRefresh={() => {
                                this.onRefresh()
                            }}
                            tintColor="#fff"
                            titleColor="#fff"
                        />
                    }
                    ListHeaderComponent={() => (<View style={styles.listHeader}/>)}
                    ListFooterComponent={() => (<View style={styles.listFooter}/>)}
                />
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
                    }}>История заказов пуста</Text>

                </View>}


        </ImageBackground>
    }

    async _deleteOperation(id) {


        this.setState({loading: true});
        try {
            let result = await this.props.deleteOperation(id);
            await this.props.getTableReserves();
        }
        catch (ex) {

        }
        this.setState({loading: false});
        this.setState({opened: null})

    }

    onRefresh() {
        this.props.getTableReserves()
    }
}

function bindAction(dispatch) {
    return {
        getTableReserves: () => {
            return dispatch(getTableReserves());
        },
        deleteOperation: (id) => {
            return dispatch(deleteOperation(id));
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    history: state.user.history,
    isPending: state.user.getHistoryPending
});
const HistoryPageSwag = connect(mapStateToProps, bindAction)(HistoryPage);
export default HistoryPageSwag;

const styles = {
    container: {
        flex: 1,
    },
    infoPoint: {
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: "#fff",
        marginHorizontal: 7
    },
    list: {},
    listHeader: {
        marginTop: 15
    },
    listFooter: {
        borderBottomWidth: 1,
        borderColor: platform.brandDivider
    },
    listItemTouch: {
        borderTopWidth: 1,
        borderColor: platform.brandDivider
    },
    listItem: {
        padding: 16,
        backgroundColor: '#2B3034',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    listItemBody: {},
    listItemHeader: {
        fontSize: 20,
        lineHeight: 20,
        color: '#ffffff'
    },
    listItemPointBlock: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listItemPriceBlock: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listItemPointText: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarning
    },
    listItemRestaurant: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandListItem
    },
    listItemIcon: {

        fontSize: 12,
        color: platform.brandListItem
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
    }
};