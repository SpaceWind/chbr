import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import Amount from "../common/Amount/index";
import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";


export default class BuyByBonusPage extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};

    componentWillMount() {

    }

    componentWillUnmount() {

    }


    render() {

        let history = this.props.navigation.state.params.history;
        return (<Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

            <ScrollView>
                <View style={historyStyles.scrollContainer}>

                    <HistoryShortInfo info={history}/>

                    <CategoryList data={fakeCategoryListArray} basket={true}/>
                </View>


            </ScrollView>
        </Image>)
    }
}


const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    }
};