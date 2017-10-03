import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Input, Item, Left, Right, Text,
    View
} from 'native-base';
import {Image, TouchableOpacity, LayoutAnimation, TouchableWithoutFeedback} from "react-native";
import platform from "../../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../../Common/ChesterIcon/index";


export default class SearchInput extends React.Component {


    state = {
        isSearching: false,
    };

    text = null;

    onFocus() {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isSearching: true,
        });
    }

    onBlur() {
        if (!this.text) {
            LayoutAnimation.easeInEaseOut();
            this.setState({
                isSearching: false,
            });
        }

    }

    onStartSearching() {
        this.refs.search.wrappedInstance.focus();
    }

    Reset() {
        this.text = null;
        this.refs.search.wrappedInstance.clear();
        this.refs.search.wrappedInstance.blur();
        this.onBlur();
        this.props.onChangeText('');

    }

    onChangeText(text) {


        if (text.length > 0) {
            this.text = text;
        }
        else {
            this.text = null;
        }
        this.props.onChangeText(text);
    }

    render() {
        const style = {
            justifyContent: this.state.isSearching
                ? 'flex-start'
                : 'center',
        };
        const styleInput = {
            width: this.state.isSearching
                ? '100%'
                : 115
        };

        return (

            <View style={styles.searchInputBlock}>
                <TouchableWithoutFeedback onPress={() => {
                    this.onStartSearching()
                }}>
                    <View style={{...styles.searchInputWarp, ...style}}>
                        <Item style={{...styles.searchInput, ...styleInput}}>
                            <ChesterIcon name="search-12" size={12} color="#fff"/>
                            <Input ref='search' placeholder={"Поиск по меню"} style={styles.codeInput}
                                   placeholderTextColor="#fff"
                                   clearButtonMode="while-editing"
                                   autoCorrect={false}
                                   keyboardAppearance="dark"
                                   onChangeText={(text) => this.onChangeText(text)} onFocus={() => {
                                this.onFocus()
                            }}
                                   onBlur={() => {
                                       this.onBlur()
                                   }}
                            />

                        </Item>


                    </View>
                </TouchableWithoutFeedback>
                { this.state.isSearching &&
                <TouchableOpacity style={{width: 'auto', marginLeft:10}} onPress={() => {
                    this.Reset();
                }}>
                    <Text style={{color:platform.brandWarning}}>Отменить</Text>
                </TouchableOpacity>}
            </View>



        );
    }


}


const styles = {

    searchInputBlock: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },

    searchInputWarp: {
        flex: 1,
        borderBottomWidth: 0,
        backgroundColor: '#4A545B',
        height: 32,
        borderRadius: 5,
        paddingLeft: 10,
        flexDirection: 'row',
    },
    searchInput: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        width: 115

    },
    codeInput: {
        color: '#fff',
        paddingLeft: 0,
        marginLeft: 5,
        fontSize: 14,
        fontFamily: platform.fontFamily,
        height: 30,
    },

};