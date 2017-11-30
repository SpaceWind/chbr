import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import {getUserData} from "../../../actions/user";


export class ScanBillPageC extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};

    componentWillMount() {
        this.props.getUserData();
    }

    componentWillUnmount() {

    }


    render() {

        let history = this.props.navigation.state.params.history;

        history.price = history.summ;
        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <View style={historyStyles.scrollContainer}>

                    <HistoryShortInfo info={history}/>

                    <View style={styles.body}>
                        <View style={styles.textBlock}>
                            <View style={{marginRight: 50}}>
                                <Text style={styles.title}>Ваши баллы</Text>
                                <Text style={styles.value}>{this.props.user.bonus_balance}</Text>
                            </View>
                            <View>
                                <Text style={styles.title}>Будет начислено</Text>
                                <Text style={styles.value}>+{history.bonus}</Text>
                            </View>
                        </View>
                        <Text style={styles.hint}>Бонусы будут доступны после 12:00 следующего дня</Text>
                    </View>
                </View>


            </ScrollView>
        </ImageBackground>)
    }
}

function bindAction(dispatch) {
    return {
        getUserData: () => dispatch(getUserData()),
    };
}

const mapStateToProps = state => ({
    user: state.user.userData
});

const ScanBillPage = connect(mapStateToProps, bindAction)(ScanBillPageC);
export default ScanBillPage;


const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textBlock: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 16,
        lineHeight: 23,
        color: platform.brandWarning
    },
    value: {
        fontSize: 63,
        lineHeight: 95,
        color: '#fff'
    },
    hint: {
        fontSize: 14,
        lineHeight: 20,
        color: platform.brandFontAccent
    }
};