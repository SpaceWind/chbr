import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import moment from "moment";
import {signStackStyle} from "../../../routers/SignStack";

export default class OneNewsPage extends React.Component {


    render() {


        let news = this.props.navigation.state.params.news;
        let restaurants = this.props.navigation.state.params.restaurants;
        return (
            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>
            <View style={styles.container}>


                <Image source={require('../../../../assets/images/cafe-1.png')} style={styles.image}>
                </Image>
                <View style={{marginHorizontal: 16}}>
                    <View style={styles.infoBlock}>

                        <Text style={styles.infoDate}>{moment(news.event_date).format('D MMM')}</Text>
                        {
                            restaurants.map((rest) => {
                                return (
                                    <View style={{flexDirection: 'row', alignItems: 'center'}} key={rest.id}>
                                        <View style={styles.infoPoint}/>
                                        <Text style={styles.infoName}>{rest.title_short}</Text>
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


            </View>
            </Image>

        );
    }
}


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
        alignItems: 'center'
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