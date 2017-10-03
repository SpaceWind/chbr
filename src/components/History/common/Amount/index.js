/*
@flow
 */
import React from 'react';
import {Text, View} from "native-base";
import platform from "../../../../../native-base-theme/variables/platform";

export default class Amount extends React.Component {

    props: {
        info: {
            amount: number;
            discount: number;
            total: number
        }
    };

    render() {
        return <View style={styles.block}>
            <View style={styles.row}>
                <Text style={styles.text}>Сумма заказа</Text>
                <Text style={styles.text}>{this.props.info.amount + ' ₽'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Скидка</Text>
                <Text
                    style={styles.text}>{(-this.props.info.discount * 100) + '%' + ' или ' + (this.props.info.amount * this.props.info.discount) + ' ₽'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Итого оплачено</Text>
                <Text style={styles.text}>{this.props.info.total + ' ₽'}</Text>
            </View>
        </View>
    }
}


const styles = {
    block: {
        paddingTop: 15,
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: '#2B3034',
        borderBottomWidth: 1,
        borderBottomColor: platform.brandDivider
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    text: {
        fontSize: 18,
        lineHeight: 20,
        color: '#fff'
    },
};