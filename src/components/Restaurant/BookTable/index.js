import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, ImageBackground, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import {signStackStyle} from "../../../routers/SignStack";
import {connect} from "react-redux";
import SelectDate from "./SelectDate";

import moment from "moment";
import 'moment-round'
import {getTime} from "../../../actions/restaurant";
import {params} from "../Restaurant/index";


class BookTable extends React.Component {


    state = {
        isOpen: false,
        count: 2,
        maxCount: 20
    };

    scrollTo: false;


    constructor(props) {
        super(props);
        let date = null;
        let currentHour = parseInt(moment().format('H'));
        let currentMinute = parseInt(moment().format('m'));
        if (currentHour < 12) {
            date = moment().floor(24, 'hours').add(12, 'hours');
        }
        else if (currentHour < 23 || (currentHour === 23 && currentMinute <= 30)) {

            if (currentHour + 2 < 23) {
                date = moment().add(2, 'hours').ceil(30, 'minutes');
            }
            else {
                date = moment().ceil(30, 'minutes');
            }
        }
        else {
            date = moment().ceil(24, 'hours').add(12, 'hours');
        }
        this.state.date = date;
        if (!props.navigation.state.params || !props.navigation.state.params.key) {
            this.restaurant = props.restaurants[params.restaurantId];
        }
        else {
            this.restaurant = props.restaurants[props.navigation.state.params.key];
        }
        this.state.count = 2;

        this.state.maxCount = Math.max.apply(null, this.restaurant.halls.reduce((all, hall) => {
            return all.concat(hall.tables.map(table => table.capacity))
        }, []));

        if (!isFinite(this.state.maxCount)) {
            this.state.maxCount = 2;
        }
    }


    componentDidMount() {
        this.getDate(this.state.count, this.state.date.unix());

    }


    render() {


        return (


            <ImageBackground source={require('../../../../assets/images/background/background.png')}
                             style={signStackStyle}>

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

                            { this.restaurant.reserving_available===1 ? <View>
                                <SelectDate
                                date={this.state.date}
                                count={this.state.count}
                                maxCount={this.state.maxCount}
                                onDateSelected={(selected) => {


                                    this.setState({date: selected.date, count: selected.count});


                                    //if (moment(this.state.date).format('YYYY DD MM') !== moment(selected.date).format('YYYY DD MM')) {
                                    this.getDate(selected.count, selected.date.unix());
                                    // }


                                }}/>

                                <View style={styles.timeSheet}>
                                    <Text style={styles.timeSheetHint}>Забронируйте столик на удобное вам время:</Text>


                                    <ScrollView horizontal style={{paddingBottom: 22, paddingTop: 14}} ref='scroll'>
                                        <View style={{flexDirection: 'row'}}>


                                            {
                                                this.props.getTimePending ?

                                                    <View style={styles.activityIndicator}>

                                                        <ActivityIndicator


                                                        />
                                                    </View>

                                                    :
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
                                                            return <View style={styles.timeButtonFill}
                                                                         key={time.timestamp}
                                                            >
                                                                <Text style={styles.timeButtonFillText}>
                                                                    {moment.unix(time.timestamp).format('HH:mm')}
                                                                </Text>
                                                            </View>
                                                        }
                                                    })
                                            }

                                        </View>
                                    </ScrollView>
                                </View>

                            </View>:
                            <View style={{paddingHorizontal: 16}}>
                                <Text >Бронирование через мобильное приложение недоступно</Text>

                            </View>}
                        </Content>
                    </Container>

                </View>
            </ImageBackground>
        );
    }


    getDate(count, date) {
        this.props.getTime(this.restaurant.id, {
            people_quantity: count,
            timestamp: date
        });

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSheet) {

            setTimeout(() => {
                this.scrollToDate(this.state.date)
            }, 20)

        }

    }


    scrollToDate(date) {
        let index = this.getTimeSheet().indexOf(this.props.timeSheet.find(time => moment.unix(time.timestamp).format('HH:mm') === date.format('HH:mm')));

        if (index > 0) {
            let currentPosition = index * 85;
            let offset = Dimensions.get('window').width / 2 - 43;
            if (currentPosition - offset > 0) {
                setTimeout(() => {
                    if (this.refs.scroll) {
                        this.refs.scroll.scrollTo({x: currentPosition - offset, y: 0});
                    }
                }, 100)
            }

        }


    }


    getTimeSheet() {
        return this.props.timeSheet.filter(time => {
            return time.timestamp > moment().unix();
        });
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
    timeSheet: state.restaurant.timeSheet,
    getTimePending: state.restaurant.getTimePending
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
    activityIndicator: {
        width: Dimensions.get('window').width,
        justifyContent: 'center'
    },
    timeButton: {
        height: 32,
        width: 77,
        borderRadius: 8,
        backgroundColor: platform.brandWarning,
        overflow: 'hidden',
        marginLeft: 4,
        marginRight: 4
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
        marginLeft: 4,
        marginRight: 4
    },
    timeButtonFillText: {
        fontFamily: platform.fontFamily,
        fontSize: 20,
        lineHeight: 29,
        textAlign: 'center',
        color: '#B3BBC1'
    }
};