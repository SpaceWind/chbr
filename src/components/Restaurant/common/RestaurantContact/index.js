import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Right, Text, View} from 'native-base';
import {Image, TouchableOpacity, Linking, Platform, ActionSheetIOS} from "react-native";
import platform from "../../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../../Common/ChesterIcon/index";
import Collapsible from 'react-native-collapsible';
import moment from "moment";
import TimeService from "../../../../services/TimeService";
import {Dimensions} from "react-native";

const {width} = Dimensions.get('window');

export default class RestaurantContact extends React.Component {


    state = {
        isOpenTime: true
    };


    days = [];
    currentDay = null;


    componentWillMount() {


        if (this.props.restaurant.schedule) {
            let timeService = new TimeService();
            if (!this.props.restaurant.schedule.length) {
                this.days = timeService.getTimesheet(this.props.restaurant.schedule);
                this.currentDay = this.days.find((item) => item.isCurrent);
            }

        }

    }

    async openDirections() {


        let coords = this.props.restaurant.address_lat + ',' + this.props.restaurant.address_lon;

        let googlePlaceId = '';
        switch (this.props.restaurant.title_short.toLowerCase()) {
            case "рестобар chester": {
                googlePlaceId = "ChIJBWUN9xxYLUERDVPKa4eoG34";
                break;
            }
            case "chester pub": {
                googlePlaceId = "ChIJBUVO5kJYLUER7PduHt1XBQo";
                break;
            }
            case "chester bar": {
                googlePlaceId = "ChIJ61bk6DuoMkER9mU1o6AGe9o";
                break;
            }
        }
        let googleMaps = `https://www.google.com/maps/search/?api=1&query=${coords}&query_place_id=${googlePlaceId}&zoom=20`;
        Platform.select({
            ios: async () => {
                let place = '';
                switch (this.props.restaurant.title_short.toLowerCase()) {
                    case "рестобар chester": {
                        place = "Рестобар+Честер+" + this.props.restaurant.address_title;
                        break;
                    }
                    case "chester pub": {
                        place = "Честер+Паб+" + this.props.restaurant.address_title;
                        break;
                    }
                    case "chester bar": {
                        place = "Честер+" + this.props.restaurant.address_title;
                        break;
                    }
                }
                let yandexNavi = `yandexnavi://show_point_on_map?lat=${this.props.restaurant.address_lat}&lon=${this.props.restaurant.address_lon}&zoom=18&no-balloon=0&desc=${this.props.restaurant.title_short}`;
                let yandexMaps = `yandexmaps://maps.yandex.ru/?ll=${this.props.restaurant.address_lon + ',' + this.props.restaurant.address_lat}&z=18&l=map&text=${"Chester " + this.props.restaurant.address_title}`;
                let hasGoogle = await Linking.canOpenURL("comgooglemaps://");
                let hasYandexNavi = await Linking.canOpenURL("yandexnavi://");
                let hasYandexMaps = await Linking.canOpenURL("yandexmaps://");
                let iosMaps = `http://maps.apple.com/maps?q=${this.props.restaurant.title_short}&ll=${coords}`;
                if (hasGoogle || hasYandexNavi || hasYandexMaps) {
                    let apps = [];

                    if (hasGoogle) {
                        apps.push({name: "Google Maps", url: googleMaps})
                    }
                    if (hasYandexNavi) {
                        apps.push({name: "Yandex.Navigator", url: yandexNavi})
                    }
                    if (hasYandexMaps) {
                        apps.push({name: "Yandex.Maps", url: yandexMaps})
                    }
                    apps.push({name: "iOS maps", url: iosMaps});
                    ActionSheetIOS.showActionSheetWithOptions({
                            options: apps.concat([{name: "Отмена"}]).map(item => item.name),
                            cancelButtonIndex: apps.length,
                        },
                        (buttonIndex) => {
                            if (buttonIndex !== apps.length) {
                                let item = apps[buttonIndex];
                                Linking.openURL(item.url);
                            }

                        });
                }
                else {
                    Linking.openURL(iosMaps);
                }
            },
            android: async () => {
                let hasGoogle = await Linking.canOpenURL(googleMaps);
                if (hasGoogle) {
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${coords}&query_place_id=${googlePlaceId}&zoom=20`);
                } else {
                    Linking.openURL(`geo:${coords}`);
                }
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
                    <View>


                        <View style={styles.status}>
                            <ChesterIcon name="time-16" size={16} color={platform.brandWarning}
                                         style={styles.timeIcon}/>
                            <Text
                                style={styles.statusText}>{this.currentDay.isOpen ? 'Сегодня открыто' : "Закрыто"}</Text>

                        </View>

                        <View style={styles.statusBottom}>

                            <Text
                                style={styles.timeTableText}>{this.currentDay.start + " - " + this.currentDay.end}</Text>

                            <TouchableOpacity onPress={() => {
                                this.setState({isOpenTime: !this.state.isOpenTime});
                                if (this.state.isOpenTime) {
                                    this.props.onOpen();
                                }

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

                <View>
                    <Collapsible collapsed={this.state.isOpenTime} duration={50}>
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
        padding: width < 340 ? 5 : 8
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