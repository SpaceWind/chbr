/*
@flow
 */
import React from 'react';

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../../native-base-theme/variables/platform";
import moment from "moment";


export default class HistoryShortInfo extends React.Component {


    props: {
        info: {
            restaurant: number;
            numberOrder: string;
            dateOrder: string;
            status: string;
            date: string;
            price?: string;
            bonus?: string;
            type: number;

        }
    };

    state = {};

    componentWillMount() {

    }

    componentWillUnmount() {

    }


    render() {
        let title = '';
        switch (this.props.info.type) {
            case 0: {
                title = "Бронирование стола";
                break;
            }
            case 2: {
                title = "Сканирование чека";
                break;
            }
            case 3: {
                title = "Бронирование стола";
                break;
            }
            case 4: {
                title = "Заказ на вынос";
                break;
            }
            /*case 5: {
                title = "Покупка за баллы";
                break;
            }*/
            case 7: {
                title = "Ланч в ресторане";
                break;
            }
        }


        let status = '';
        switch (this.props.info.status) {
            case 0: {
                status = "Подтвержден";
                break;
            }
            case 1: {
                status = "Исполнен";
                break;
            }
            case 2: {
                status = "В обработке";
                break;
            }
            case 3: {
                status = "Ожидает выдачи";
                break;
            }
        }


        let bonus = this.props.info.type === 4 ? -this.props.info.bonus : this.props.info.bonus;
        let bonusText = bonus + ' ' + 'бал.';

        return <View>
            <View style={styles.order}>
                <Text
                    style={styles.orderText}>{'Заказ №' + this.props.info.numberOrder + ' от ' + moment(this.props.info.dateOrder).format('D MMM HH:mm')}</Text>
                <View style={styles.orderStatusSuccess}>
                    <Text style={styles.orderStatusText}>{status}</Text>
                </View>
                <View style={styles.orderStatusWarning}>
                    <Text style={styles.orderStatusText}>{status}</Text>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={styles.headerText}>{title}</Text>
                <Text style={styles.restaurantText}>{title}</Text>
                <View style={styles.pointBlock}>
                    <Text style={styles.pointText}>{moment(this.props.info.date).format('D MMM, HH:mm')}</Text>
                    {this.props.info.type !== 4 && <View style={styles.priceBlock}>
                        <View style={styles.infoPoint}/>
                        <Text style={styles.pointText}>{this.props.info.price + ' ₽'}</Text>
                    </View>}
                    <View style={styles.infoPoint}/>
                    <Text style={styles.pointText}>{bonusText}</Text>
                </View>
            </View>
        </View>

    }
}


const styles = {
    order: {
        paddingTop: 15,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    orderText: {
        color: platform.brandFontAccent
    },
    orderStatusSuccess: {
        borderRadius: 10,
        backgroundColor: platform.brandSuccess
    },
    orderStatusWarning: {
        borderRadius: 10,
        backgroundColor: platform.brandWarning
    },
    orderStatusText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#fff'
    },
    info: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: platform.brandDivider
    },
    headerText: {
        fontSize: 28,
        lineHeight: 34,
        color: platform.brandWarningAccent
    },
    restaurantText: {
        fontSize: 20,
        lineHeight: 29,

        color: '#fff'
    },
    infoPoint: {
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: "#fff",
        marginHorizontal: 7
    },
    listItemRestaurant: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandListItem
    },
    pointBlock: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceBlock: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pointText: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarning
    },
};