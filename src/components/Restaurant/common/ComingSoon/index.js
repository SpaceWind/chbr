//@flow
import React from 'react';
import {Body, Button, Card, CardItem, Container, Content, Icon, Left, Picker, Right, Text, View} from 'native-base';

import ChesterIcon from "../../../Common/ChesterIcon/index";

import {modalCardStyles} from "../../../Profile/Profile/index";
import MyModal from "../../../Common/MyModal/index";


export default class ComingSoon extends React.Component {


    props: {
        isOpen: boolean,
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
                        onRequestClose={() => this.props.onClose()}>
            <View style={modalCardStyles.modal}>
                <View style={modalCardStyles.hintRow}>
                    <View style={modalCardStyles.textRow} >
                        <Text style={modalCardStyles.removeText}>Заказ на вынос</Text>
                        <Text style={modalCardStyles.removeTextQuestion}>Заказы на вынос и ланч в ресторане будет
                            доступен в следующих обновлениях!</Text>
                    </View>
                    <ChesterIcon  name="trash" size={56} color={"#fff"}/>
                </View>

                <View style={modalCardStyles.buttonRow}>
                    <Button bordered rounded light full style={modalCardStyles.cancelButton} onPress={() => {
                        this.props.onClose()
                    }
                    }>
                        <Text uppercase={false} style={modalCardStyles.buttonText}>ОК</Text>
                    </Button>
                </View>

            </View>

        </MyModal>

    }

}
