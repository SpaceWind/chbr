import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import moment from "moment";

export default class OneNews extends React.Component {


    render() {

        let image = this.props.data.photos && this.props.data.photos.find((image) => image.sort === -1);
        let containerStyle = styles.container;
        if (image) {
            image = {uri: image.s3_url}
        }
        else {
            containerStyle = {...containerStyle, ...styles.containerBordered};
        }


        return (
            <View style={containerStyle}>


                {image && <Image source={image} style={styles.image}>
                </Image>}
                <View style={{marginHorizontal: 16}}>
                    <View style={styles.infoBlock}>

                        {this.props.data.show_event_date === 1 &&
                        <Text style={styles.infoDate}>{moment(this.props.data.event_date).format('D MMMM')}</Text>}
                        {
                            this.props.restaurants.map((rest,i) => {
                                console.log(i);
                                return (
                                    <View style={{flexDirection: 'row', alignItems: 'center'}} key={rest.id}>
                                        { (i!==0 || this.props.data.show_event_date === 1) && <View style={styles.infoPoint}/>}
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
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29
    }


};