import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, ScrollView, TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import {signStackStyle} from "../../../routers/SignStack";
import {connect} from "react-redux";
import SelectDate from "./SelectDate";

import moment from "moment";
import 'moment-round'
import {getTime} from "../../../actions/restaurant";


class BookTable extends React.Component {


    state = {
        isOpen: false,
        count: 2
    };

    constructor(props) {
        super(props);
        let currentHour = parseInt(moment().format('H'));
        let currentMinute = parseInt(moment().format('m'));
        if (currentHour < 12) {
            this.state.date = moment().floor(24, 'hours').add(12, 'hours');
        }
        else if (currentHour < 23 || (currentHour === 23 && currentMinute <= 30)) {

            if (currentHour + 2 < 23) {
                this.state.date = moment().add(2, 'hours').ceil(30, 'minutes');
            }
            else {
                this.state.date = moment().ceil(30, 'minutes');
            }
        }
        else {
            this.state.date = moment().ceil(24, 'hours').add(12, 'hours');
        }

        this.restaurant = props.restaurants[this.props.navigation.state.params.key];
        this.state.count = 2;
    }


    componentDidMount() {
        this.props.getTime(this.restaurant.id, {
            people_quantity: this.state.count,
            timestamp: this.state.date.unix()
        })
    }


    render() {


        return (


            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

                <View style={styles.container}>


                    <Container>

                        <Content>
                            <View style={{paddingHorizontal: 16, marginBottom: 20}}>
                                <Text style={styles.header}>
                                    Бронирование стола
                                </Text>
                                <Text style={styles.restaurantName}>
                                    {this.restaurant.title_full}
                                </Text>

                            </View>

                            <SelectDate
                                date={this.state.date}
                                count={this.state.count}
                                onDateSelected={(selected) => {

                                    this.props.getTime(this.restaurant.id, {
                                        people_quantity: selected.count,
                                        timestamp: selected.date.unix()
                                    });

                                    this.setState({date: selected.date, count: selected.count});
                                }}/>

                            <View style={styles.timeSheet}>
                                <Text style={styles.timeSheetHint}>Забронируйте столик на удобное вам время:</Text>


                                <ScrollView horizontal style={{paddingBottom: 22, paddingTop: 14}}>
                                    <View style={{flexDirection: 'row'}}>

                                        {
                                            this.getTimeSheet().map(time => {

                                                if (time.state === 'enabled') {
                                                    return <TouchableOpacity style={styles.timeButton}
                                                                             key={time.timestamp}
                                                                             onPress={() => {
                                                                                 this.navigateToBook(time)
                                                                             }}>
                                                        <Text style={styles.timeButtonText}>
                                                            {moment.unix(time.timestamp).format('HH:mm')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                }
                                                else {
                                                    return <View style={styles.timeButtonFill} key={time.timestamp}
                                                    >
                                                        <Text style={styles.timeButtonFillText}>
                                                            {time.title}
                                                        </Text>
                                                    </View>
                                                }
                                            })
                                        }


                                    </View>
                                </ScrollView>
                            </View>


                        </Content>
                    </Container>

                </View>
            </Image>
        );
    }


    getTimeSheet() {
        return this.props.timeSheet.filter(time => {
            return time.timestamp > this.state.date.unix();
        })
    }

    navigateToBook(time) {
        this.props.navigation.navigate('BookTableConfirm', {
            time: time,
            restaurant: this.restaurant,
            people_quantity: this.state.count
        })
    }
}

function bindAction(dispatch) {
    return {
        getTime: (restaurantId, data) => {
            return dispatch(getTime(restaurantId, data))
        }
    };
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants,
    timeSheet: state.restaurant.timeSheet
});
const BookTableSwag = connect(mapStateToProps, bindAction)(BookTable);
export default BookTableSwag;

const styles = {
    container: {
        flex: 1,

    },
    header: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 28,
        lineHeight: 40,
        marginTop: 15,
    },
    restaurantName: {
        fontSize: 20,
        lineHeight: 29,
    },

    text: {
        color: platform.brandFontAccent,
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20
    },
    timeSheet: {
        paddingTop: 13,
        marginTop: 19,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: platform.brandDivider,
    },
    timeSheetHint: {
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 16
    },
    timeButton: {
        height: 32,
        width: 77,
        borderRadius: 8,
        backgroundColor: platform.brandWarning,
        overflow: 'hidden',
        marginLeft: 4,
        marginRight: 3
    },
    timeButtonText: {
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29,
        textAlign: 'center'
    },
    timeButtonFill: {
        height: 32,
        width: 77,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: platform.brandOutline,
        marginHorizontal: 5
    },
    timeButtonFillText: {
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29,
        textAlign: 'center',
        color: '#B3BBC1'
    }
};