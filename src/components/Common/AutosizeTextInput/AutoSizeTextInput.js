//@flow
import React from 'react';
import {TextInput} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";

export default class AutoSizeTextInput extends React.Component {

    props: {
        value: string,
        onChangeText: (val) => void
    };

    constructor(props) {
        super(props);
        this.state = {
            newValue: '',
            height: 40
        }
    }

    updateSize = (height) => {
        this.setState({
            height
        });
    };

    render() {
        const {newValue, height} = this.state;

        let newStyle = {
            height
        };

        return (
            <TextInput
                underlineColorAndroid="transparent"
                onChangeText={(value) => this.props.onChangeText({value})}
                style={[newStyle,styles.input]}
                editable={true}
                multiline={true}
                value={this.props.value}
                onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
            />
        )
    }

}


const styles = {
    input:{
        width: '100%',
        fontFamily: platform.fontFamily,
        fontSize: 20,
        paddingVertical: 16,
        color: "#fff"
    }
}