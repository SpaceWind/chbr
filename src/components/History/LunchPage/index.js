import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import Amount from "../common/Amount/index";
import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";
import {getOperation, getReserve} from "../../../actions/user";


class LunchPageC extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};


    constructor(props) {
        super(props);
        this.resultId = this.props.navigation.state.params.resultId;
    }

    componentWillMount() {
        this.props.getOperation(this.resultId);
    }

    componentWillUnmount() {

    }


    render() {
        let operation = this.props.operation;
        let restaurantName = '';
        if (operation) {
            let restaurant = this.props.restaurants[operation.restaurant_id];
            restaurantName = restaurant.title_short;
        }
        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                {operation &&   <View style={historyStyles.scrollContainer}>

                    <HistoryShortInfo info={operation}/>

                    <Amount info={history}/>

                    <View style={styles.body}>
                        <FieldValue name="Имя и фамилия" value={history.name}/>
                        <FieldValue name="Время" value={history.time}/>
                        <FieldValue name="Комментарий к заказу" value={history.comment}/>
                    </View>

                    <CategoryList data={fakeCategoryListArray} basket={true}/>
                </View>}


            </ScrollView>
        </ImageBackground>)
    }
}

function bindAction(dispatch) {
    return {
        getReserve: (restaurantId, reserveId) => {
            dispatch(getReserve(restaurantId, reserveId));
        },
        getOperation: (operationId) => {
            dispatch(getOperation(operationId));
        }
    };
}

const mapStateToProps = state => ({
    reserve: state.user.reserve,
    restaurants: state.restaurant.restaurants,
    isReservePending: state.user.isReservePending,
    isOperationPending: state.user.isOperationPending,
    operation: state.user.operation,
});
const LunchPage = connect(mapStateToProps, bindAction)(LunchPageC);
export default LunchPage;

const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    }
};