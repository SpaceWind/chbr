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
import {params} from "../../Restaurant/Restaurant/index";

class News extends React.Component {

    state = {};
    restaurantId = null;


    constructor(props) {
        super(props);
        if (!props.navigation.state.params || !props.navigation.state.params.key) {
            this.restaurantId = params.restaurantId;
        }
        else {
            this.restaurantId = props.navigation.state.params.key;
        }
    }


    componentWillMount() {
        this.props.getNews(this.restaurantId);
    }

    _onRefresh = () => {
        this.props.getNews(this.restaurantId);
    };

    render() {


        let restaurant = this.props.restaurants[this.restaurantId];

        let newsData = this.props.news;
        newsData = newsData.filter((news, pos) => {
            return newsData.indexOf(newsData.find((inNews) => inNews.id === news.id)) === pos;
        });

        return (
            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>

                <View style={styles.container}>


                    {((newsData && newsData.length !== 0) || this.props.isPending) ? <FlatList
                            ListHeaderComponent={() => {
                                return <Text style={styles.header}>
                                    Новости и акции
                                </Text>
                            }}
                            data={newsData}
                            renderItem={(rowData) => {
                                return <TouchableOpacity
                                    style={{marginBottom: 25}}
                                    onPress={
                                        () => {
                                            this.props.navigation.navigate('OneRestaurantNewsPage', {
                                                news: rowData.item,
                                                restaurants: [restaurant]
                                            })
                                        }
                                    }
                                >
                                    <OneNews data={rowData.item} restaurants={[restaurant]}/>
                                </TouchableOpacity>
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
                                    paddingHorizontal: 20
                                }}> На данный момент действующих акций нет.</Text>

                            </View>
                        </View>
                    }
                </View>
            </ImageBackground>
        );
    }
}

function bindAction(dispatch) {
    return {
        getNews: (key) => {
            return dispatch(getNews(key));
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    news: state.news.news,
    isPending: state.news.getNewsPending
});
const NewsSwag = connect(mapStateToProps, bindAction)(News);
export default NewsSwag;

const styles = {
    container: {
        flex: 1,
    },
    header: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 28,
        lineHeight: 40,
        marginBottom: 14,
        marginTop: 15,
        paddingHorizontal: 16
    },

};