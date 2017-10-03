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

class News extends React.Component {

    state = {};

    componentWillMount() {
        let key = this.props.navigation.state.params && this.props.navigation.state.params.key;
        this.props.getNews(key);
    }

    _onRefresh = () => {
        let key = this.props.navigation.state.params && this.props.navigation.state.params.key;
        this.props.getNews(key);
    };

    render() {
        let restaurant = this.props.restaurants[this.props.navigation.state.params.key];

        let newsData = this.props.news;
        newsData = newsData.filter((news, pos) => {
            return newsData.indexOf(newsData.find((inNews) => inNews.id === news.id)) === pos;
        });

        return (
            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

                <View style={styles.container}>


                    <FlatList
                        ListHeaderComponent={() => {
                            return <Text style={styles.header}>
                                Новости и акции
                            </Text>
                        }}
                        data={newsData}
                        renderItem={(rowData) => <View style={{marginBottom: 25}}>
                            <OneNews data={rowData.item} restaurants={[restaurant]}/>
                        </View>}
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