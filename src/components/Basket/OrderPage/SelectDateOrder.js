//@flow

import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import MyModal from "../../Common/MyModal/index";
import platform from "../../../../native-base-theme/variables/platform";
import {Picker, TouchableOpacity, Platform, BackHandler} from "react-native";
import moment from "moment";
import 'moment-round'
import Octicons from 'react-native-vector-icons/Octicons';
import AndroidPicker from 'react-native-picker';

export default class SelectDateOrder extends React.Component {

    props: {
        maxCount: number,
        start: any,
        end: any
    }

    state = {
        count: 2
    };

    constructor(props) {
        super();
        this.state.date = props.date;
        this.initDate = this.state.date;
        this.state.day = this.state.date.clone().floor(24, 'hours').format();
        this.state.hour = this.state.date.format();
    }


    componentWillMount() {
        if (Platform.OS !== 'ios') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
        }
    }

    componentWillUnmount() {
        if (Platform.OS !== 'ios') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
        }
    }

    onBackPress() {
        AndroidPicker.isPickerShow(status => {
            status && AndroidPicker.hide();
        });
        return false;
    }

    setDay(date) {
        date = moment(date);
        let selectedHour = parseInt(this.state.date.format('H'));
        let selectedMinutes = parseInt(this.state.date.format('m'));

        if (date.format('ddd D MMMM') === moment().format('ddd D MMMM')) {
            let currentHour = parseInt(moment().format('H'));
            let currentMinute = parseInt(moment().format('m'));
            if (currentHour > selectedHour || (currentHour === selectedHour && currentMinute > selectedMinutes)) {
                date = moment().ceil(30, 'minutes');
            }
            else {
                date = date.floor(24, 'hours').add(selectedHour, 'hours').add(selectedMinutes, 'minutes');
            }
        }
        else {
            date = date.floor(24, 'hours').add(selectedHour, 'hours').add(selectedMinutes, 'minutes');
        }

        this.setState({
            day: date.clone().floor(24, 'hours').format(),
            hour: date.format(),
            date
        });


    }

    setHour(date) {
        date = moment(date);
        this.setState({
            day: date.clone().floor(24, 'hours').format(),
            hour: date.format(),
            date
        });
    }


    getDays() {
        return [{
            name: 'сегодня',
            date: moment().floor(24, 'hours').format(),
            value: 0
        }];
    }

    getHours(startDate) {

        let date = startDate.clone();
        let hours = [];
        let currentDate = startDate.add(1, "hours");


        if (currentDate < this.props.start) {
            currentDate = this.props.start.clone().ceil(15, 'minutes');
        }
        else {
            currentDate = currentDate.ceil(15, 'minutes');
        }

        while (currentDate <= this.props.end) {
            currentDate = currentDate.clone().floor(15, 'minutes');
            hours.push({
                name: currentDate.format('HH:mm'),
                date: currentDate.format()
            });
            currentDate.add(15, 'minutes');
        }


        return hours;
    }


    selectDate() {
        this.props.onDateSelected({
            count: this.state.count,
            date: this.state.date
        });
        this.refs.modal.close()
    }

    getCurrentSelection() {
        let dateFormatted = '';
        dateFormatted += this.props.count + ' ' + (this.props.count === 1 || this.props.count >= 5 ? 'человек' : 'человека');
        dateFormatted += ', ';
        if (this.props.date.day() === moment().day()) {
            dateFormatted += 'сегодня, ' + this.props.date.format('HH:mm');
        }
        else {
            dateFormatted += this.props.date.format('ddd D MMMM, HH:mm');
        }
        return dateFormatted;
    }

    setModalVisible(visible) {
        this.setState({isOpen: visible});
    }

    showModal() {
        if (Platform.OS === 'ios') {
            this.setModalVisible(true)
        }
        else {


            let selectedDay = "";
            let selectedHour = "";

            selectedDay = 'сегодня';
            selectedHour = this.props.date.format('HH:mm');


            let fullHours = this.getFullHours();
            let days = this.getDays().map((day, i) => {
                let hours = null;
                if (i === 0) {
                    hours = this.getHours(moment()).map(item => item.name);
                }
                let result = {};
                result[day.name] = hours;
                return result;
            });
            let pickerData =
                Array.from(new Array(this.props.maxCount), (val, index) => index + 1).map((count) => {
                    let result = {};
                    result[count + " чел"] = days;
                    return result;

                });


            let selected = [];
            AndroidPicker.init({
                pickerConfirmBtnText: 'Готово',
                pickerCancelBtnText: 'Отмена',
                pickerTitleText: '',
                pickerConfirmBtnColor: [255, 185, 69, 1],
                pickerCancelBtnColor: [255, 185, 69, 1],
                pickerToolBarBg: [43, 48, 52, 1],
                pickerBg: [43, 48, 52, 1],
                pickerFontColor: [255, 255, 255, 1],
                pickerData: pickerData,
                pickerFontSize: 21,
                pickerToolBarFontSize: 20,
                selectedValue: [this.props.count + " чел", selectedDay, selectedHour],
                onPickerConfirm: data => {


                    let count = parseInt(data[0].split(' ')[0]);


                    let date = data[1];

                    if (date === 'сегодня') {
                        date = moment(moment().format('ddd D MMMM') + ' ' + data[2], "ddd D MMMM HH:mm");
                    }
                    else {
                        date = moment(date + ' ' + data[2], "ddd D MMMM HH:mm");
                    }


                    this.props.onDateSelected({
                        count: count,
                        date: date
                    });
                    console.log(count + '    ' + date);


                },
                onPickerCancel: data => {
                    console.log(data);
                },
                onPickerSelect: data => {
                    selected = data;
                    console.log(data);
                }
            });
            AndroidPicker.show();
        }

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.date && nextProps.date !== this.props.date) {

            this.setState({
                date: nextProps.date
            })

        }
    }

    render() {
        return <View>


            <Text style={styles.hint}>Выберите время и количество человек</Text>

            <View>
                <TouchableOpacity onPress={() => {
                    this.showModal();
                }}>
                    <View style={styles.selectDate}>

                        <Octicons name="calendar" size={14}
                                  color={'#fff'}
                                  style={styles.selectDateIcon}/>
                        <Text style={styles.selectDateText}>{this.getCurrentSelection()}</Text>


                    </View>
                </TouchableOpacity>
            </View>

            <View>
                {Platform.OS === 'ios' && this.state.isOpen &&
                <MyModal style={{height: 261, backgroundColor: "#2B3034"}} isOpen={this.state.isOpen} ref="modal"
                         position={'bottom'}
                         onRequestClose={() => {
                             this.setModalVisible(false)
                         }}>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                        paddingBottom: 10,
                        paddingTop: 6,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: platform.brandDivider
                    }}>


                        <TouchableOpacity
                            onPress={() => {
                                this.refs.modal.close();
                            }}
                        >
                            <Text style={{
                                color: platform.brandWarning,
                                fontSize: 20,
                                lineHeight: 29,
                                fontFamily: platform.fontFamily
                            }}>
                                Отмена
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectDate();
                            }}
                        >
                            <Text style={{
                                color: platform.brandWarning,
                                fontFamily: platform.fontFamily,
                                fontSize: 20,
                                lineHeight: 29
                            }}>Готово</Text>
                        </TouchableOpacity>
                    </View>

                    <View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 17,

                        }}>


                            <Picker style={{width: 100, borderWidth: 0}}
                                    itemStyle={{fontFamily: platform.fontFamily, color: '#fff', textAlign: 'center'}}
                                    selectedValue={this.state.count}
                                    onValueChange={(itemValue, itemIndex) => this.setState({count: itemValue})}
                            >
                                {Array.from(new Array(this.props.maxCount), (val, index) => index + 1).map((item, i) => {
                                    return <Picker.Item key={i} label={item + " чел"} value={item}/>
                                })}
                            </Picker>
                            <Picker style={{flex: 1}}
                                    itemStyle={{fontFamily: platform.fontFamily, color: '#fff', textAlign: 'center'}}
                                    selectedValue={this.state.day}
                                    onValueChange={(itemValue, itemIndex) => this.setDay(itemValue)}
                            >
                                {this.getDays().map((item, i) => {
                                    return <Picker.Item key={i} label={item.name} value={item.date}/>
                                })}
                            </Picker>
                            <Picker style={{width: 90}}
                                    itemStyle={{fontFamily: platform.fontFamily, color: '#fff', textAlign: 'center'}}
                                    selectedValue={this.state.hour}
                                    onValueChange={(itemValue, itemIndex) => this.setHour(itemValue)}
                            >
                                {this.getHours(moment()).map((item, i) => {
                                    return <Picker.Item key={i} label={item.name} value={item.date}/>
                                })}
                            </Picker>
                        </View>

                        <View
                            style={{
                                position: 'absolute',
                                top: 90,
                                left: 17,
                                right: 17,
                                height: 1,
                                backgroundColor: "#3B4248"
                            }}/>
                        <View
                            style={{
                                position: 'absolute',
                                top: 125,
                                left: 17,
                                right: 17,
                                height: 1,
                                backgroundColor: "#3B4248"
                            }}/>
                    </View>

                </MyModal>}
            </View>


        </View>
    }
}


const styles = {
    container: {
        flex: 1,
    },
    hint: {
        paddingTop: 9,
        paddingBottom: 7,
        paddingHorizontal: 16,
        color: platform.brandFontAccent,
        fontSize: 14,
        lineHeight: 20,


    },
    selectDate: {
        height: 36,
        marginHorizontal: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#4A545B',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectDateIcon: {
        paddingRight: 8

    },
    selectDateText: {
        fontFamily: platform.fontFamily,
        fontSize: 16,
        lineHeight: 23,
    },
};