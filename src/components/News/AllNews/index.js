import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {FlatList, Image, ImageBackground, ListView, RefreshControl, TouchableOpacity} from "react-native";
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
        newsData.sort((a, b) => {
            return a.sort - b.sort;
        });
        if (this.state.restaurant !== 'all') {
            newsData = newsData.filter((news, pos) => {
                return news.restaurants.length === 0 && news.event_place_all || news.restaurants.find(rest => rest.id === this.state.restaurant)
            });
        }


        let restaurants = this.props.restaurants.filter((rest) => rest.status === 1);

        return (
            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>
                <View style={styles.container}>
                    {((newsData && newsData.length !== 0) || this.props.isPending) ? <FlatList
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
                                        restaurants={restaurants}
                                        restaurant={this.state.restaurant}/>
                                </View>


                            </View>
                        }}
                        data={newsData}
                        renderItem={(rowData) => {
                            let restaurants = null;

                            if (rowData.item.restaurants.length > 0 ) {
                                restaurants = this.props.restaurants.filter(rest => rowData.item.restaurants.find(restNews => rest.id === restNews.id));
                            }
                            else {
                                restaurants = [];
                            }
                            const all = rowData.item.restaurants.length === this.props.restaurants.filter((item) => {
                                return item.status === 1;
                            }).length;

                            return (<TouchableOpacity
                                style={{marginBottom: 25}}
                                onPress={
                                    () => {
                                        this.props.navigation.navigate({
                                            routeName: 'OneNewsPage',
                                            params: {
                                                news: rowData.item,
                                                restaurants
                                            },
                                            key: "OneNewsPage"
                                        });
                                    }
                                }
                            >
                                <OneNews data={rowData.item} restaurants={restaurants} all={all}/>
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

:
                    <View style={{

                        flex: 1,
                        width: null,
                        height: null,
                    }}>

                        <Text style={styles.header}>
                            Новости и акции
                        </Text>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            width: null,
                            height: null,
                        }}>
                            <Text style={{
                                fontSize: 22,
                                lineHeight: 33,
                                textAlign: 'center',
                                paddingHorizontal:20
                            }}> На данный момент действующих акций нет.</Text>

                        </View>
                    </View>}

                </View>
            </ImageBackground>
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