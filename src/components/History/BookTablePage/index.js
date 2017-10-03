import React from 'react';
import {connect} from "react-redux";
import {signStackStyle} from "../../../routers/SignStack";
import {FlatList, Image, ScrollView} from "react-native";

import {Text, View, Icon, Button} from "native-base";

import platform from "../../../../native-base-theme/variables/platform";
import HistoryShortInfo from "../common/HistoryShortInfo/index";
import FieldValue from "../common/FieldValue/index";
import historyStyles from "../common/historyStyle";
import {getReserve} from "../../../actions/user";
import {Spinner} from "react-native-loading-spinner-overlay";


class BookTablePageC extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.name
    });

    state = {};


    constructor(props)
    {
        super(props);
        this.reserveParam = this.props.navigation.state.params.history;
    }

    componentWillMount() {
        this._getReserve();
    }

    componentWillUnmount() {

    }


    render() {

        let history = this.props.navigation.state.params.history;


        return (<Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

            <ScrollView >
                <View style={historyStyles.scrollContainer}>


                    <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>
                    <HistoryShortInfo info={history}/>



                    <View style={styles.body}>
                        <FieldValue name="Комментарий к заказу" value={history.comment}/>
                    </View>


                    <View style={styles.buttonBlock}>

                        <View style={{
                            width: '50%', paddingRight: 7,
                        }}>
                            <Button success full rounded
                                    style={{
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => {

                                    }}

                            >
                                <Text uppercase={false}>Отменить</Text>
                            </Button>
                        </View>

                        <View style={{
                            width: '50%', paddingLeft: 7,
                        }}>
                            <Button warning full rounded style={{
                                flex: 1,
                                marginLeft: 7,
                                justifyContent: 'center',
                                paddingLeft: 10,
                                paddingRight: 10,
                                overflow: 'hidden'
                            }}
                                    onPress={() => {

                                    }}>
                                <Text uppercase={false}>Сохранить чек</Text>
                            </Button>
                        </View>
                    </View>
                </View>


            </ScrollView>
        </Image>)
    }


    async _getReserve()
    {

        this.props.getReserve()
    }
}

function bindAction(dispatch) {
    return {
        getReserve: (restaurantId, reserveId) => {
            dispatch(getReserve(restaurantId, reserveId));
        }
    };
}

const mapStateToProps = state => ({
    reserve: state.user.reserve,
    isReservePending: state.user.isReservePending
});
const BookTablePage= connect(mapStateToProps, bindAction)(BookTablePageC);
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