import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {FlatList, Image, ListView, RefreshControl, TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";
import OneNews from "../OneNews/index";
import {getNews} from "../../../actions/news";
import {connect} from "react-redux";
import SelectRestaurant from "../../Common/Form/SelectRestaurant/index";

class NewsC extends React.Component {

    state = {
        restaurant: 'all'
    };

    componentWillMount() {
        this.props.getNews();
    }

    _onRefresh = () => {
        this.props.getNews();
    };

    render() {

        let newsData = this.props.news;
        newsData = newsData.filter((news, pos) => {
            return newsData.indexOf(newsData.find((inNews) => inNews.id === news.id)) === pos;
        });

        if (this.state.restaurant !== 'all') {
            newsData = newsData.filter((news, pos) => {
                return news.restaurants.length === 0 || news.restaurants.find(rest => rest === this.state.restaurant)
            });
        }


        return (
            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>
                <View style={styles.container}>
                    <FlatList
                        ListHeaderComponent={() => {
                            return <View>
                                <Text style={styles.header}>
                                    Новости и акции
                                </Text>
                                <View style={styles.selectRestaurant}>
                                    <SelectRestaurant
                                        onRestaurantSelected={(ev) => {

                                            this.setState({
                                                restaurant: ev.restaurant
                                            })
                                        }
                                        }
                                        restaurants={this.props.restaurants}
                                        restaurant={this.state.restaurant}/>
                                </View>


                            </View>
                        }}
                        data={newsData}
                        renderItem={(rowData) => {
                            let restaurants = null;
                            if (rowData.item.restaurants.length > 0 && this.props.restaurants.length !== rowData.item.restaurants.length) {
                                restaurants = this.props.restaurants.filter(rest => rowData.item.restaurants.find(restId => rest.id === restId));
                            }
                            else {
                                restaurants = [{id: 1, title_short: 'Все рестораны'}]
                            }
                            return (<TouchableOpacity
                                style={{marginBottom: 25}}
                                onPress={
                                    () => {
                                        this.props.navigation.navigate('OneNewsPage', {
                                            news: rowData.item,
                                            restaurants
                                        })
                                    }
                                }
                            >
                                <OneNews data={rowData.item} restaurants={restaurants}/>
                            </TouchableOpacity>)
                        }}
                        extraData={this.state}
                        keyExtractor={item => item.id}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isPending}
                                onRefresh={this._onRefresh}
                                tintColor="#fff"
                                titleColor="#fff"
                            />
                        }
                    >
                    </FlatList>
                </View>
            </Image>
        );
    }
}

function bindAction(dispatch) {
    return {
        getNews: () => {
            return dispatch(getNews());
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurantsArray,
    news: state.news.news,
    isPending: state.news.getNewsPending
});
const AllNews = connect(mapStateToProps, bindAction)(NewsC);
export default AllNews;

const styles = {
    container: {
        flex: 1,
    },
    header: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 28,
        lineHeight: 40,
        marginBottom: 12,
        marginTop: 15,
        paddingHorizontal: 16
    },
    selectRestaurant: {
        marginBottom: 22
    }

};