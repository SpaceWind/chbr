import React from 'react'
import {Modal} from 'react-native'
import ModalBox from 'react-native-modalbox'


export default class MyModal extends React.Component {

    static defaultProps = {
        animationDuration: 280,
        backButtonClose: true,
    };

    close()
    {
        this.refs.modal.close()
    }

    render = ()=>(
        <Modal visible={this.props.isOpen} transparent={true} onRequestClose={() => {}}>
            <ModalBox {...this.props} onClosed={this.props.onRequestClose} ref="modal"/>
        </Modal>
    )
}