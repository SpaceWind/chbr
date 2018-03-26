import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import { TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import moment from "moment";

import ImageWithDefault from "../ImageWithDefault";


export default class OneNews extends React.Component {


    render() {

        let image = this.props.data.photos && this.props.data.photos.find((image) => image.sort === -1);
        let containerStyle = styles.container;
        if (image) {
            image = {
                uri: image.s3_url,
                cache: 'force-cache',
            }
        }
        else {
            containerStyle = {...containerStyle, ...styles.containerBordered};
        }

        let restaurants = this.props.restaurants;
        if (this.props.all) {
            restaurants = [{
                id: "all",
                title_short: "Все рестораны"
            }]
        }


        return (
            <View style={containerStyle}>


                {image && <ImageWithDefault
                    source={image} style={styles.image}
                    renderError={(err) => {
                        return <View style={{
                            ...styles.image,
                            flexDirection:'column',
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:"#fff"
                        }}><Text
                            style={{
                                color:platform.brandOutline,
                                fontFamily: platform.fontFamily,
                                fontSize: 28,
                                lineHeight: 40
                            }}

                        >Новость миниатюра</Text></View>
                    }}
                >
                </ImageWithDefault>}
                <View style={{marginHorizontal: 16}}>
                    <View style={styles.infoBlock}>

                        {this.props.data.show_event_date === 1 &&
                        <Text style={styles.infoDate}>{moment(this.props.data.event_date).format('D MMMM')}</Text>}
                        {
                            restaurants.map((rest, i) => {

                                return (
                                    <View style={{flexDirection: 'row', alignItems: 'center'}} key={rest.id}>
                                        {(i !== 0 || this.props.data.show_event_date === 1) &&
                                        <View style={styles.infoPoint}/>}
                                        <Text style={styles.infoName}>{rest.title_short}</Text>
                                    </View>
                                )
                            })
                        }

                    </View>
                    <Text style={styles.header}>
                        {this.props.data.title}
                    </Text>
                </View>


            </View>

        );
    }
}


const styles = {
    container: {

        flex: 1,
    },
    containerBordered: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 25,
        borderColor: platform.brandDivider
    },
    image: {
        height: 150,
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
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29
    }


};