import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon, Text} from 'native-base';
import ChesterIcon from "../../../components/Common/ChesterIcon/index";
import {connect} from "react-redux";
import platform from "../../../../native-base-theme/variables/platform";


class BasketIconC extends React.Component {

    render() {
        let navigation = this.props.navigation;


        let total = this.props.billing.dishes.reduce((a, b) => {
            return a + b.price * b.count;
        }, 0);

        return (
            <View>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Basket');
                }}>
                    <View style={{padding: 10, marginLeft: 10, flexDirection: 'row'}}>

                        {total > 0 && <Text style={
                            {
                                color: platform.brandWarning,
                                fontSize: 16,
                                lineHeight: 21
                            }
                        }>
                            {total + " ₽ "}
                        </Text>}
                        <ChesterIcon name="trash" size={22} color={"#fff"}/>


                    </View>


                </TouchableOpacity>
            </View>
        );
    }

}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    billing: state.billing
});
const BasketIcon = connect(mapStateToProps, bindAction)(BasketIconC);
export default BasketIcon;