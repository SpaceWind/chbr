import React from 'react';
import ComponentSlider from "../Common/ComponentSlider/index";
import {Button, Text, View} from "native-base";
import {Dimensions, Image, TouchableOpacity, Platform, ImageBackground} from "react-native";
import {signStackStyle} from "../../routers/SignStack";
import platform from "../../../native-base-theme/variables/platform";
import {closeTutorial} from "../../actions/user";
import {connect} from "react-redux";
import Constants from "../../../utilities/Constants";

import Swiper from 'react-native-swiper';

class TutorialPageC extends React.Component {

    state = {
        position: 0
    }
    index = 0;

    render() {


        return (
            <ImageBackground source={require('./../../../assets/images/background/background.png')}
                             style={{
                                 height: Dimensions.get('window').height - (Platform.OS === 'ios' ? 0 : Constants.STATUSBAR_HEIGHT),
                                 width: null,
                                 paddingTop: 30
                             }}>


                <Swiper style={styles.wrapper}
                        loop={false}
                        dotColor={'rgba(255,255,255,0.3)'}
                        activeDotColor={'#fff'}
                        ref='swiper'
                        onIndexChanged={(i) => {
                            this.index = i;
                        }}
                >

                    <View style={{flex: 1}}>
                        {this._renderComponent(
                            'Вас приветствует сеть ресторанов Chester!',
                            'В приложении вы сможете получить самую актуальную информацию о наших ресторанах, акциях и событиях',
                            require('./../../../assets/images/tutorial/tutorial-1.png'))}
                    </View>
                    <View style={{flex: 1}}>
                        {this._renderComponent(
                            'Бонусная программа',
                            'Можно копить бонусные баллы и тратить их на десерты и напитки. Есть возможность получить постоянную скидку 10%\n',
                            require('./../../../assets/images/tutorial/tutorial-2.png')
                        )}
                    </View>
                    <View style={{flex: 1}}>
                        {this._renderComponent(
                            'Заказ еды и бронирование столов',
                            'Заказывайте еду на вынос со скидкой. Также можно заказать еду в ресторан на удобное время. ',
                            require('./../../../assets/images/tutorial/tutorial-3.png')
                        )}
                    </View>
                    <View style={{flex: 1}}>
                        {this._renderComponent(
                            'Не пропустите важное!',
                            'Мы будем рассказывать вам только о самых выгодных акциях и интересных событиях.',
                            require('./../../../assets/images/tutorial/tutorial-4.png'),
                            true
                        )}
                    </View>
                </Swiper>
            </ImageBackground>)


    }

    /*
    <ComponentSlider

                        height={Dimensions.get('window').height - (Platform.OS !== 'ios' ? Constants.STATUSBAR_HEIGHT : 0) - 30}
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
                    */

    _renderComponent(title, text, image, button) {

        return <View style={{height: '100%'}}>
            <View style={styles.fakeImage}/>
            <Image source={image} style={styles.image}/>
            <View style={styles.body}>

                <ImageBackground source={require('./../../../assets/images/background/background.png')}
                                 style={styles.bodyBackground} imageStyle={styles.bodyBackground}>
                    <TouchableOpacity onPress={() => {
                        if (this.index === 3) {
                            this.props.closeTutorial();
                        }
                        else {

                            this.refs.swiper.scrollBy(1, true)
                        }

                    }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.text}>{text}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        {button && <Button bordered warning rounded style={styles.button} onPress={() => {
                            this.props.closeTutorial();
                        }}>
                            <Text uppercase={false}>Начать работу</Text>
                        </Button>}
                    </View>

                </ImageBackground>

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
        zIndex: 2,
        width: '100%',

        position: 'absolute',
        top: 0
    },
    fakeImage: {
        flex: 1
    },
    body: {
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 1,
        shadowRadius: 16,

        height: 294,
        alignItems: 'center',
        zIndex: 3,

    },
    bodyBackground: {
        width: Dimensions.get('window').width,
        height: null,
        flex: 1,
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