import React from 'react';
import {
    Body, Button, Card, CardItem, Container, Content, Icon, Left, List, ListItem, Right, Text,
    View
} from 'native-base';
import {Image, TouchableOpacity} from "react-native";
import platform from "../../../../native-base-theme/variables/platform";
import ChesterIcon from "../../Common/ChesterIcon/index";
import {signStackStyle} from "../../../routers/SignStack";
import {connect} from "react-redux";


class Team extends React.Component {


    renderMember(item) {
        return (
            <View style={styles.member} key={item.id}>
                <Image source={{uri:item.avatar_url}} style={styles.memberImage}>
                </Image>

                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberType}>{item.position}</Text>
                </View>


            </View>
        )
    }


    render() {


        return (


            <Image source={require('../../../../assets/images/background/background.png')} style={signStackStyle}>

                <View style={styles.container}>
                    <Container >
                        <Content>
                            <View style={{paddingHorizontal: 16}}>
                                <Text style={styles.header}>

                                    Команда

                                </Text>
                                <Text style={styles.text}>
                                    Мы каждый день старается сделать времяпровождение
                                    в нашем ресторане максимально вкусным, уютным и комфортным для наших гостей!
                                </Text>

                            </View>


                            {
                                this.props.restaurants[[this.props.navigation.state.params.key]].employees.map((item) => {
                                    return this.renderMember(item);
                                })
                            }


                        </Content>
                    </Container>

                </View>
            </Image>
        );
    }
}
function bindAction(dispatch) {
    return {};
}
const mapStateToProps = state => ({
    restaurants: state.restaurant.restaurants
});
const TeamSwag = connect(mapStateToProps, bindAction)(Team);
export default TeamSwag;


const styles = {
    container: {
        flex: 1,

    },
    header: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 28,
        lineHeight: 40,
        marginBottom: 7,
        marginTop: 15,
    },
    text: {
        color: platform.brandFontAccent,
        fontFamily: platform.fontFamily,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 30
    },
    member: {
        flexDirection: 'row',
        paddingLeft: 16,
        alignItems: 'center',
        marginBottom: 12

    },
    memberImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 16,
        marginBottom: 15
    },
    memberInfo: {
        paddingBottom: 15,
        borderColor: '#656D73',
        borderBottomWidth: 1,
        flex: 1
    },
    memberName: {
        fontFamily: platform.fontFamily,
        fontSize: 22,
        lineHeight: 31,
    },
    memberType: {
        color: platform.brandWarningAccent,
        fontFamily: platform.fontFamily,
        fontSize: 16,
        lineHeight: 23,
    }

};