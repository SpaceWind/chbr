import React from 'react';
import ComponentSlider from "../Common/ComponentSlider/index";
import {Button, Text, View} from "native-base";
import {Dimensions, Image} from "react-native";
import {signStackStyle} from "../../routers/SignStack";
import platform from "../../../native-base-theme/variables/platform";
import {closeTutorial} from "../../actions/user";
import {connect} from "react-redux";


class TutorialPageC extends React.Component {

    state = {
        position: 0
    }

    render() {


        return (
            <Image source={require('./../../../assets/images/background/background.png')}
                   style={{height: Dimensions.get('window').height, width: null, paddingTop: 30}}>
                <ComponentSlider
                    height={Dimensions.get('window').height - 30}
                    components={
                        [
                            () => {
                                return this._renderComponent(
                                    'Вас приветствует сеть ресторанов Chester!',
                                    'В приложении вы сможете получить самую актуальную информацию о наших ресторанах, акциях и событиях',
                                    require('./../../../assets/images/tutorial/tutorial-1.png')
                                );
                            },
                            () => {
                                return this._renderComponent(
                                    'Бонусная программа',
                                    'Можно копить бонусные баллы и тратить их на десерты и напитки. Есть возможность получить постоянную скидку 10%\n',
                                    require('./../../../assets/images/tutorial/tutorial-2.png')
                                );
                            },
                            () => {
                                return this._renderComponent(
                                    'Заказ еды и бронирование столов',
                                    'Заказывайте еду на вынос со скидкой. Также можно заказать еду в ресторан на удобное время. ',
                                    require('./../../../assets/images/tutorial/tutorial-3.png')
                                );
                            },
                            () => {
                                return this._renderComponent(
                                    'Не пропустите важное!',
                                    'Мы будем рассказывать вам только о самых выгодных акциях и интересных событиях.',
                                    require('./../../../assets/images/tutorial/tutorial-4.png'),
                                    true
                                );
                            }


                        ]
                    }
                    position={this.state.position}
                    onPositionChanged={position =>
                        this.setState({position}
                        )}


                />
            </Image>)


    }


    _renderComponent(title, text, image, button) {

        return <View>
            <Image source={image} style={styles.image}/>
            <View style={styles.body}>

                <Image source={require('./../../../assets/images/background/background.png')}
                       style={styles.bodyBackground}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.text}>{text}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        {button && <Button bordered warning rounded style={styles.button} onPress={() => {
                            this.props.closeTutorial();
                        }}>
                            <Text>Начать работу</Text>
                        </Button>}
                    </View>

                </Image>

            </View>

        </View>
    }

}

function bindAction(dispatch) {
    return {
        closeTutorial: () => {
            return dispatch(closeTutorial());
        }
    };
}

const mapStateToProps = state => ({});
const TutorialPage = connect(mapStateToProps, bindAction)(TutorialPageC);

export default TutorialPage;

const styles = {
    image: {
        zIndex: 2
    },
    body: {
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 1,
        shadowRadius: 16,

        alignItems: 'center',
        zIndex: 3,

    },
    bodyBackground: {
        width: '100%',
        height: '100%',
        paddingTop: 20,
        paddingHorizontal: 50,
    },
    title: {
        fontSize: 24,
        lineHeight: 34,
        color: platform.brandWarningAccent,
        textAlign: 'center'

    },
    text: {
        marginTop: 12,
        fontSize: 20,
        lineHeight: 29,
        textAlign: 'center'
    },
    button: {
        marginTop: 20
    }
};