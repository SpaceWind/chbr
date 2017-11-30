import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView, Alert} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import {getReserve} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import {cancelReserve} from "../../../actions/restaurant";

class BookTablePageC extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};


    constructor(props) {
        super(props);
        this.history = this.props.navigation.state.params.history;
    }

    componentWillMount() {
        this._getReserve();
    }

    componentWillUnmount() {

    }


    render() {

        let history = this.history;
        let reserve = this.props.reserve || {};

        let restaurant = this.props.restaurants[this.history.restaurant_id];
        let restaurantName = restaurant.title_short;

        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <ScrollView>
                <View style={historyStyles.scrollContainer}>


                    <Spinner visible={this.props.isReservePending || this.state.loading} textStyle={{color: '#FFF'}}/>
                    <HistoryShortInfo info={history} result={history.result_data} restaurantName={restaurantName}/>


                    <View style={styles.body}>
                        <FieldValue name="Комментарий к заказу" value={reserve.comment}/>
                    </View>


                    {this.history.status!==6 && <View style={styles.buttonBlock}>

                        <View style={{
                            width: '100%', paddingHorizontal: 7,
                        }}>
                            <Button danger full rounded
                                    style={{
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => {

                                        this._cancelReserve()
                                    }}

                            >
                                <Text uppercase={false}>Отменить</Text>
                            </Button>
                        </View>


                    </View>}
                </View>


            </ScrollView>
        </ImageBackground>)
    }


    async _getReserve() {
        try {
            await this.props.getReserve(this.history.restaurant_id, this.history.result_id);
        }
        catch
            (ex) {
            setTimeout(() => {
                Alert.alert(
                    'Ошибка',
                    'Не удалось загрузить информацию.',
                    [

                        {
                            text: 'Ок', onPress: () => {


                        }
                        }
                    ]
                )
            }, 10);
        }

    }

    async _cancelReserve() {
        this.setState({loading: true});
        try {
            await this.props.cancelReserve(this.history.restaurant_id, this.history.result_id);
            this.history.status = 6;
            this.setState({loading: false});


        }
        catch
            (ex) {
            this.setState({loading: false});
            setTimeout(() => {
                Alert.alert(
                    'Ошибка',
                    'Не удалось выполнить операцию',
                    [

                        {
                            text: 'Ок', onPress: () => {


                        }
                        }
                    ]
                )
            }, 10);
        }

    }

}

function bindAction(dispatch) {
    return {
        getReserve: (restaurantId, reserveId) => {
            dispatch(getReserve(restaurantId, reserveId));
        },
        cancelReserve: (restaurantId, reserveId) => {
            dispatch(cancelReserve(restaurantId, reserveId));
        },
    };
}

const mapStateToProps = state => ({
    reserve: state.user.reserve,
    restaurants: state.restaurant.restaurants,
    isReservePending: state.user.isReservePending
});
const BookTablePage = connect(mapStateToProps, bindAction)(BookTablePageC);
export default BookTablePage;


const styles = {
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 8,

    },
    buttonBlock: {
        marginTop: 'auto',
        marginBottom: 30,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    }
};