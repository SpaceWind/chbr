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

        return (
            <View style={styles.container}>


                <Image source={require('../../../../assets/images/cafe-1.png')} style={styles.image}>
                </Image>
                <View style={{marginHorizontal: 16}}>
                    <View style={styles.infoBlock}>

                        <Text style={styles.infoDate}>{moment(this.props.data.event_date).format('D MMM')}</Text>
                        {
                            this.props.restaurants.map((rest) => {
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