import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ImageBackground, ScrollView, Alert} from "react-native";

import {Text, View, Icon, Button} from "native-base";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import Amount from "../common/Amount/index";
import CategoryList, {fakeCategoryListArray} from "../../Restaurant/Category/CategoryList";
import {deleteOperation, getOrder, getTableReserves} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import {NavigationActions} from "react-navigation";
import platform from "../../../../native-base-theme/variables/platform";


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
        this.props.getOrder(this.resultId);
    }

    componentWillUnmount() {

    }


    render() {


        this.order = this.props.order && this.props.order.order;

        let restaurantName = '';
        if (this.order) {
            console.log(this.order);
            let restaurant = this.props.restaurants[this.order.restaurant_id];
            restaurantName = restaurant.title_short;
            this.operation = Object.assign({}, this.order);
            this.operation.resultData = {
                people_quantity: this.order.people_quantity,
                timestamp: this.order.issue_time
            };
            this.operation.price = this.order.summ;
            this.operation.type = this.order.type === 3 ? 4 : 7;

            this.food = Object.values(this.order.food).map((food) => {
                return {
                    count: food.quantity,
                    price: food.price,
                    ...food.food_info
                }

            });

        }


        return (<ImageBackground source={require('../../../../assets/images/background/background.png')}
                                 style={signStackStyle}>

            <Spinner visible={this.props.getOrderPending}
                     textStyle={{color: '#FFF'}}/>
            <ScrollView>
                <Spinner visible={!this.props.order && this.state.loading}
                         textStyle={{color: '#FFF'}}/>

                {this.props.order && <View style={historyStyles.minScrollContainer}>


                    <HistoryShortInfo info={this.operation} result={this.operation.resultData}
                                      restaurantName={restaurantName}/>


                    {(this.order.summ !== this.order.summ_raw && this.order.summ < this.order.summ_raw) &&
                    <Amount info={this.order}/>}


                    <View style={styles.body}>
                        <FieldValue name="Имя и фамилия"
                                    value={this.order.client_firstname + " " + this.order.client_lastname}/>
                        <FieldValue name="Время" value={moment.utc(this.order.issue_time).local().format("HH:mm")}/>
                        {!!(this.order.comment && this.order.comment !== "") &&
                        <FieldValue name="Комментарий к заказу" value={this.order.comment}/>}
                    </View>

                    <View style={{
                        height: 73 * this.food.length,
                        borderColor: platform.brandDivider,
                        borderBottomWidth: 1,
                        borderTopWidth: 1
                    }}>
                        <CategoryList data={this.food} basket={true}/>
                    </View>


                    {(this.operation.status === 5 || this.operation.status === 6) && <View style={styles.buttonBlock}>

                        <View style={{
                            width: '100%', paddingHorizontal: 7,
                        }}>
                            <Button danger full rounded
                                    style={{
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => {
                                        this._requestDelete()
                                    }}><Text uppercase={false}>Удалить из истории</Text>
                            </Button>
                        </View>


                    </View>}

                </View>}


            </ScrollView>
        </ImageBackground>)
    }

    _requestDelete() {
        Alert.alert(
            'Вы уверены?',
            'Данная информация будет удалена из истории',
            [
                {
                    text: 'Нет', onPress: () => {
                }, style: 'cancel'
                },
                {
                    text: 'Ок', onPress: () => {
                    this._cancelOperation()
                }
                }
            ]
        );
    }

    async _cancelOperation() {
        this.setState({loading: true});
        try {
            let result = await this.props.deleteOperation(this.operation.id);
            this.props.getTableReserves();
            this.setState({loading: false});
            const backAction = NavigationActions.back();
            this.props.navigation.dispatch(backAction)
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
        getOrder: (orderId) => {
            return dispatch(getOrder(orderId));
        },
        getTableReserves: () => {
            return dispatch(getTableReserves());
        },
        deleteOperation: (id) => {
            return dispatch(deleteOperation(id));
        }
    };
}

const mapStateToProps = state => ({
    reserve: state.user.reserve,
    restaurants: state.restaurant.restaurants,
    getOrderPending: state.user.getOrderPending,
    order: state.user.order,
    user: state.user.userData
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
    },
    buttonBlock: {
        marginTop: 'auto',
        marginBottom: 30,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    }
};