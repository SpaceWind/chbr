import React from 'react';
import Image from 'react-native-image-progress';
import {

    View
} from 'native-base';
export default class ImageWithDefault extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            failed: false
        };
    }

    _onError = () => {
        this.setState({failed: true});
    }

    render() {

        let indicator = <View></View>;
        if (this.props.default) {
            indicator = <Image source={this.props.default} style={this.props.style}/>;
        }
        else if (this.props.renderError) {
            indicator = this.props.renderError()
        }

        if (this.state.failed) return indicator;

        return (
            <Image
                {...this.props}
                onError={this._onError}
            />
        );
    }
}