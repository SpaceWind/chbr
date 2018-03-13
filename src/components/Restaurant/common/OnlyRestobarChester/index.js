//@flow
import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Picker, Right, Text, View} from 'native-base';


import {modalCardStyles} from "../../../Profile/Profile/index";
import MyModal from "../../../Common/MyModal/index";
import {Image} from "react-native";


export default class OnlyRestobarChester extends React.Component {


    props: {
        isOpen: boolean,
        restaurantName: any,
        onClose: () => void
    };

    componentWillMount() {

    }

    componentWillUnmount() {

    }


    render() {


        return <MyModal style={{height: 215, backgroundColor: "#7A8187"}} isOpen={this.props.isOpen}
                        ref="modal"
                        position={'bottom'}
                        onRequestClose={() => {
                            this.props.onClose()
                        }
                        }>
            <View style={modalCardStyles.modal}>
                <View style={modalCardStyles.hintRow}>
                    <View style={modalCardStyles.textRow}>
                        <Text style={modalCardStyles.removeText}>Заказ недоступен</Text>
                        <Text style={modalCardStyles.removeTextQuestion}>На данный момент заказы доступны только в
                            Рестобар Chester. {this.props.restaurantName} подключится в следующих обновлениях.</Text>
                    </View>
                    <Image
                        source={require('../../../../../assets/images/restaurant/sorry.png')}
                    />
                </View>

                <View style={modalCardStyles.buttonRow}>
                    <Button bordered rounded light full style={modalCardStyles.cancelButton}
                            onPress={() => {
                                this.props.onClose(true)
                            }
                            }>
                        <Text uppercase={false} style={modalCardStyles.buttonText}>ОК</Text>
                    </Button>
                </View>

            </View>

        </MyModal>

    }

}
