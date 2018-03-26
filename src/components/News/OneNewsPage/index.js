import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, ImageBackground, ScrollView, TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import moment from "moment";
import {signStackStyle} from "../../../routers/SignStack";
import {connect} from "react-redux";
import {getOneNews} from "../../../actions/news";
import Spinner from "react-native-loading-spinner-overlay";
import ImageWithDefault from "../ImageWithDefault";


class OneNewsPageС extends React.Component {


    componentWillMount() {

    }


    render() {

        let news = null;
        let image = null;
        if (this.props.navigation.state.params && this.props.navigation.state.params.news) {
            news = this.props.navigation.state.params.news;
            image = news.photos && news.photos.find((image) => image.sort !== -1);
            if (image) {
                image = {
                    uri: image.s3_url,
                    cache: 'force-cache'
                }
            }


        }
        else {

            news = this.props.oneNews;
            if (news) {
                image = news.photos && news.photos.main;
                if (image) {
                    image = {
                        uri: image,
                        cache: 'force-cache'
                    }
                }
            }


        }

        let all = false;
        if (news) {
            if (!news.restaurants) {
                news.restaurants = []
            }
            if (news.restaurants.length === this.props.restaurants.filter((item) => {
                    return item.status === 1;
                }).length) {
                news.restaurants = [{
                    id: "all",
                    title: "Все рестораны"
                }]
            }


        }


        return (
            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>

                <Spinner visible={this.props.isPending}
                         textStyle={{color: '#FFF'}}/>
                {news && <ScrollView>
                    {image ? <ImageWithDefault
                            source={image}
                            style={styles.image}
                            renderError={(err) => {
                                return <View style={{
                                    ...styles.image,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: "#fff"
                                }}><Text
                                    style={{
                                        color: platform.brandOutline,
                                        fontFamily: platform.fontFamily,
                                        fontSize: 28,
                                        lineHeight: 40
                                    }}
                                >Новость - полное фото</Text></View>
                            }}

                        /> :
                        <View style={{height: 20}}></View>
                    }
                    <View style={{marginHorizontal: 16, marginBottom: 16}}>
                        <View style={styles.infoBlock}>

                            {news.show_event_date === 1 &&
                            <Text style={styles.infoDate}>{moment(news.event_date).format('D MMMM')}</Text>}
                            {
                                news.restaurants.map((rest, i) => {
                                    return (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}} key={rest.id}>
                                            {(i !== 0 || news.show_event_date === 1) &&
                                            <View style={styles.infoPoint}/>}
                                            <Text style={styles.infoName}>{rest.title}</Text>
                                        </View>
                                    )
                                })
                            }

                        </View>
                        <Text style={styles.header}>
                            {news.title}
                        </Text>
                        <Text style={styles.text}>
                            {news.text}
                        </Text>
                    </View>


                </ScrollView>}
            </ImageBackground>

        );
    }
}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurantsArray,
    news: state.news.news,
    oneNews: state.news.oneNews,
    isPending: state.news.getOneNewsPending
});
const OneNewsPage = connect(mapStateToProps, bindAction)(OneNewsPageС);
export default OneNewsPage;

const styles = {
    container: {
        flex: 1,
    },
    image: {
        height: 196,
        width: null,
        marginBottom: 7
    },
    infoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    infoDate: {
        color: platform.brandWarning,
        fontFamily: platform.fontFamily,
        fontSize: 16,
        lineHeight: 23
    },
    infoPoint: {
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: "#fff",
        marginHorizontal: 7
    },
    infoName: {
        color: platform.brandWarning,
        fontFamily: platform.fontFamily,
        fontSize: 16,
        lineHeight: 23
    },
    header: {
        fontSize: 20,
        lineHeight: 29
    },
    text: {
        marginTop: 11,
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    }


};