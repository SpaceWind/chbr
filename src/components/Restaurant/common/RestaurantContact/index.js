import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Right, Text, View} from 'native-base';
import {Image, TouchableOpacity, Linking, Platform} from "react-native";
import platform from "../../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../../Common/ChesterIcon/index";
import Collapsible from 'react-native-collapsible';
import moment from "moment";
import TimeService from "../../../../services/TimeService";

export default class RestaurantContact extends React.Component {


    state = {
        isOpenTime: true
    };


    days = [];
    currentDay = null;


    componentWillMount() {


        if (this.props.restaurant.schedule) {
            let timeService = new TimeService();
            if(!this.props.restaurant.schedule.length)
            {
                this.days = timeService.getTimesheet(this.props.restaurant.schedule);
                this.currentDay = this.days.find((item) => item.isCurrent);
            }

        }

    }

    openDirections() {

        Platform.select({
            ios: () => {
                Linking.openURL('http://maps.apple.com/maps?daddr=' + this.props.restaurant.address_lat + ',' + this.props.restaurant.address_lon);
            },
            android: () => {
                Linking.openURL('http://maps.google.com/maps?daddr=' + this.props.restaurant.address_lat + ',' + this.props.restaurant.address_lon);
            }
        })();
    }

    async openPhone() {
        try {
            await Linking.openURL('tel:' + this.props.restaurant.phone);
        }
        catch (ex) {

        }


    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.contactBlock}>
                    <View >


                        <View style={styles.status}>
                            <ChesterIcon name="time-16" size={16} color={platform.brandWarning}
                                         style={styles.timeIcon}/>
                            <Text
                                style={styles.statusText}>{ this.currentDay.isOpen ? 'Сегодня открыто' : "Закрыто"}</Text>

                        </View>

                        <View style={styles.statusBottom}>

                            <Text
                                style={styles.timeTableText}>{this.currentDay.start + " - " + this.currentDay.end}</Text>

                            <TouchableOpacity onPress={() => {
                                this.setState({isOpenTime: !this.state.isOpenTime})
                            }}>
                                <View style={styles.schedule}>
                                    <Text style={styles.scheduleText}>Режим работы</Text>

                                    {
                                        this.state.isOpenTime ? <ChesterIcon name="arrow-down-orange-12" size={8}
                                                                             color={platform.brandWarning}
                                                                             style={styles.scheduleIcon}/> :
                                            <ChesterIcon name="arrow-up-12" size={8} color={platform.brandWarning}
                                                         style={styles.scheduleIcon}/>
                                    }


                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={styles.circleBlock}>

                        <TouchableOpacity style={{...styles.circle, marginRight: 15}}
                                          onPress={() => {
                                              this.openPhone()
                                          }}>
                            <ChesterIcon name="phone-16" size={18} color={platform.brandWarning}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circle} onPress={() => {
                            this.openDirections()
                        }}>
                            <ChesterIcon name="location-16" size={18} color={platform.brandWarning}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View >
                    <Collapsible collapsed={this.state.isOpenTime}>
                        <View style={styles.timesheet}>

                            {

                                this.days.map((day) => {
                                    let styleDay = styles.oneDay;
                                    if (day.isCurrent) {
                                        styleDay = {...styleDay, ...styles.currentOneDay}
                                    }
                                    let styleName = styles.oneDayName;
                                    if (day.day === 6 || day.day === 0) {
                                        styleName = {...styleName, color: platform.brandDanger}
                                    }


                                    return (
                                        <View style={styleDay} key={day.id}>
                                            <Text style={styleName}>{day.name}</Text>
                                            <Text style={styles.oneDayStart}>{day.start}</Text>
                                            <Text style={styles.oneDayEnd}>{day.end}</Text>
                                        </View>)
                                })
                            }


                        </View>
                    </Collapsible>
                </View>
            </View>
        );
    }
}


const styles = {
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: platform.brandDivider,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    contactBlock: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusBottom: {
        paddingLeft: 23
    },
    timeIcon: {
        marginRight: 7
    },
    schedule: {
        flexDirection: 'row',

    },
    statusText: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandFontAccent
    },
    timeTableText: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    },
    scheduleText: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandWarning
    },

    scheduleIcon: {
        marginTop: 5,
        marginLeft: 5
    },
    circleBlock: {
        flexDirection: 'row',

    },
    circle: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 40,
        borderColor: platform.brandOutline
    },
    timesheet: {
        paddingTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    oneDay: {
        padding: 8
    },
    currentOneDay: {

        borderRadius: 4,
        borderWidth: 1,
        borderColor: platform.brandWarning
    }
    ,
    oneDayName: {
        fontSize: 16,
        lineHeight: 23,
        textAlign: "center",
        color: platform.brandFontAccent
    },
    oneDayStart: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: "center",
        color: platform.brandFontAccent
    },
    oneDayEnd: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: "center",
        color: platform.brandFontAccent
    }


};