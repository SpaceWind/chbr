import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, TouchableOpacity, Animated, LayoutAnimation, ScrollView, Modal, Picker} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";
import Collapsible from 'react-native-collapsible';
import SearchInput from "../common/SearchInput/index";
import CategoryList from "../Category/CategoryList";
import {connect} from "react-redux";

class Menu extends React.Component {

    state = {
        activeSection: null,
        results: null,
        isOpen: false,
        hour: 30
    };

    changeState(item) {

        if (this.state.activeSection === item) {
            this.setState({
                activeSection: null
            })
        }
        else {
            this.setState({
                activeSection: item
            })
        }

    }

    _renderHeader(section, category) {
        return (
            <View>
                <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                        if (category) {
                            this.changeState(section.id)
                        }
                        else {
                            this.props.navigation.navigate('Category', {
                                id: section.id,
                                name: section.title,
                                restaurant: this.props.restaurants[this.props.navigation.state.params.key]
                            })
                        }
                    }}>
                    <Text style={styles.listItemText}>{section.title}</Text>
                    <View>
                        {
                            this.state.activeSection === section.title ?
                                <Icon style={styles.listItemIcon} name="arrow-up"/>
                                : <Icon style={styles.listItemIcon} name="arrow-forward"/>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderContent(section) {

        return (
            <List dataArray={section.categories}
                  renderRow={(item) =>
                      <View>
                          <TouchableOpacity
                              style={styles.subListItem}
                              onPress={() => {

                                  this.props.navigation.navigate('Category', {
                                      id: item.id,
                                      name: item.title,
                                      restaurant: this.props.restaurants[this.props.navigation.state.params.key]
                                  })

                              }}>
                              <View style={styles.subListItemBody}>
                                  <ChesterIcon size={6} name="bullet" color={platform.brandDivider}/>
                                  <Text style={styles.subListItemText}>{item.title}</Text>
                              </View>
                              <View>
                                  <Icon style={styles.subListItemIcon} name="arrow-forward"/>
                              </View>
                          </TouchableOpacity>
                      </View>

                  }>
            </List>
        );
    }


    getAllDish() {
        return this.props.restaurants[this.props.navigation.state.params.key].menu.categories
            .reduce((a, b) => {
                let items = [];
                if (b.categories) {
                    items = b.categories.reduce((a, subCategory) => {
                        return a.concat(subCategory.items);
                    }, [])
                } else {
                    items = b.items;
                }
                return a.concat(items);
            }, []);
    }

    onStartSearch(text) {
        if (text.length > 0) {
            let result = [];
            if (this.state.results) {
                result = this.state.results;
            }
            else {
                result = this.getAllDish();
            }
            result = result.filter((dish) => dish.title.includes(text.trim()));

            this.setState({
                text: text,
                results: result
            });
        }
        else {
            this.setState({
                results: null
            })
        }

    }


    render() {


        return (

            <View style={styles.container}>
                <Container style={{flex: 1}}>
                    <Content keyboardShouldPersistTaps="always" style={{flex: 1, minHeight: '100%'}}>
                        <SearchInput onChangeText={(text) => {

                            this.onStartSearch(text)
                        }}/>
                        {this._renderList()}
                    </Content>
                </Container>
            </View>

        );
    }


    _renderList() {

        let categories = this.props.restaurants[this.props.navigation.state.params.key].menu.categories;

        if (!this.state.results) {
            return categories.map((item, i) => {
                if (item.categories) {
                    return (
                        <View key={i}>
                            {this._renderHeader(item, true)}
                            <Collapsible collapsed={this.state.activeSection !== item.id}>
                                {this.state.activeSection === item.id ? this._renderContent(item) :
                                    <View/>}
                            </Collapsible>
                        </View>)
                }
                else {
                    return (
                        <View key={i}>
                            {this._renderHeader(item)}
                        </View>)
                }

            });
        }
        else {
            if (this.state.results.length > 0) {
                return (<CategoryList data={this.state.results} navigation={this.props.navigation}/>)
            }
            else {
                return <View style={{alignItems: 'center', marginTop: 40}}>

                    <View style={{alignItems: 'center', width: 300}}>
                        <Text style={{
                            fontSize: 22,
                            lineHeight: 33,
                            textAlign: 'center'
                        }}>Не найдено</Text>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 24,
                            textAlign: 'center'
                        }}>Поиск «{this.state.text}» не дал результатов. Попытайтесь задать что-нибудь другое.</Text>

                    </View>

                </View>
            }

        }


    }
}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants
});
const MenuSwag = connect(mapStateToProps, bindAction)(Menu);
export default MenuSwag;

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#2B3034',
        paddingTop: 7,
        zIndex: 1
    },
    listItem: {
        height: 52,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: platform.brandDivider,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 16

    },
    listItemText: {
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 20
    },
    listItemIcon: {
        fontSize: 16,
        color: platform.brandListItem,

    },

    subListItem: {
        height: 52,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: platform.brandDivider,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 16

    },
    subListItemBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    subListItemText: {
        marginLeft: 10,
        fontFamily: platform.fontFamily,
        fontSize: 18,
        lineHeight: 20,
        color: platform.brandListItem,
    },
    subListItemIcon: {
        fontSize: 16,
        color: platform.brandListItem,

    }

};