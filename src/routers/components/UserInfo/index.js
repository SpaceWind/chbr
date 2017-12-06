/*@flow*/

import React from 'react';
import {Image, TouchableOpacity, Alert, Platform} from "react-native";
import {Button, Text, View} from "native-base";
import platform from "../../../../native-base-theme/variables/platform";
import {connect} from "react-redux";
import {getUserData, setSignState, signOut, uploadPhoto} from "../../../actions/user";
import Spinner from "react-native-loading-spinner-overlay";
import ChesterIcon from "../../../components/Common/ChesterIcon/index";
import {AnimatedCircularProgress} from 'react-native-circular-progress';

let ImagePicker = require('react-native-image-picker');

class UserInfoC extends React.Component {

    bonusAmount = 100000;
    props: {
        showName: boolean,
        navigation: any,
        userData: any
    };

    state = {
        loading: false
    }

    componentWillMount() {
        if (this.props.logged) {
            this.props.getUserData();
        }

    }

    declOfNum(number, titles) {
        cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }


    render() {


        if (this.props.logged) {


            let progress = this.props.userData ? (this.props.userData.money_spent / this.bonusAmount) * 100 : 0;

            return (<View style={styles.container}>
                <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}}/>


                <View>
                    <AnimatedCircularProgress
                        size={112}
                        width={2}
                        fill={progress}
                        tintColor="#f89336"
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#d1d3c9"
                        rotation={0}
                        style={styles.avatarProgress}
                    />
                    <View style={styles.avatarOuterProgress}>
                        {this.props.userData && <TouchableOpacity
                            disabled={this.props.userData.avatar && !this.props.showName}
                            onPress={() => {
                                this.props.userData.avatar && this.props.showName ? this.props.navigation.navigate('Profile') : this._pickImage();
                            }}>
                            <View style={styles.avatarInner}>

                                {this.props.userData.avatar ?
                                    <Image source={{uri: this.props.userData.avatar}}
                                           style={{width: 92, height: 92, borderRadius: 46}}
                                    />
                                    : <Image source={require('../../../../assets/images/navigation/user_icon.png')}
                                             style={{width: 48, resizeMode: 'contain', marginLeft: 5}}/>}
                            </View>
                        </TouchableOpacity>}


                        {!this.props.showName &&
                        <TouchableOpacity style={styles.editAvatar} onPress={() => {
                            this._pickImage();
                        }}>
                            <ChesterIcon name={'edit-16'} size={16} color={platform.brandWarning}/>
                        </TouchableOpacity>}
                    </View>

                </View>


                <TouchableOpacity disabled={!this.props.showName} onPress={() => {
                    this.props.navigation.navigate('Profile')
                }
                }>
                    {this.props.userData && (this.props.userData.first_name || this.props.userData.last_name)
                        ?
                        <Text
                            style={styles.bottomAvatarText}>{this.props.userData.first_name} {this.props.userData.last_name}</Text>
                        :
                        <Text style={styles.bottomAvatarText}>Ваш аккаунт</Text>
                    }
                </TouchableOpacity>
                <View>
                    <Button style={styles.bonusButton} rounded warning onPress={() => {
                        this.props.navigation.navigate('MyCard');
                    }}>

                        {this.props.userData && <Text
                            style={styles.buttonText}
                              uppercase={false}>
                            {(this.props.userData.bonus_balance + ' ' + this.declOfNum(this.props.userData.bonus_balance, ['балл', 'балла', 'баллов']) + ' >')}
                            </Text>}
                    </Button>

                </View>

            </View>)
        }
        else {
            return (<View style={styles.container}>

                <View style={styles.avatarOuter}>
                    <View style={styles.avatarInner}>

                        <Image source={require('../../../../assets/images/navigation/user_icon.png')}
                               style={{width: 48, resizeMode: 'contain'}}/>
                    </View>
                </View>


                {this.props.showName && <Text style={styles.bottomAvatarText}>Ваш аккаунт</Text>}

                <View>
                    <Button style={styles.button} rounded warning onPress={() => {
                        this.props.signIn()
                    }}>
                        <Text style={styles.buttonText} uppercase={false}>Войти ></Text>
                    </Button>

                </View>
            </View>)
        }

    }

    _pickImage = async () => {
        let options = {
            title: 'Выбрать фото',
            mediaType: 'photo',
            cameraType: 'front',
            allowsEditing: true,
            cancelButtonTitle: ' Отменить ',
            takePhotoButtonTitle: 'Сделать снимок',
            chooseFromLibraryButtonTitle: 'Выбрать фотографию'
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        ImagePicker.showImagePicker(options, async (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};
                this.setState({loading: true});
                try {
                    let result = await this.props.uploadPhoto(response.uri);
                    await this.props.getUserData();


                }
                catch (ex) {
                    setTimeout(() => {
                        Alert.alert(
                            'Ошибка',
                            'Попробуйте позже.',
                            [
                                {
                                    text: 'Ок'
                                    , onPress: () => {
                                }
                                }
                            ]
                        )
                    }, 100);
                }
                this.setState({loading: false});
            }
        });
    };
}

function bindAction(dispatch) {
    return {
        logOut: () => dispatch(signOut()),
        signIn: () => dispatch(setSignState(true)),
        getUserData: (text) => dispatch(getUserData()),
        uploadPhoto: (photoUri) => dispatch(uploadPhoto(photoUri))
    };
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    userData: state.user.userData,
});


const UserInfo = connect(mapStateToProps, bindAction)(UserInfoC);
export default UserInfo;
/*<View style={styles.container} >
 <Image/>
 <Text style={styles.bottomAvatarText}>Катя кищук</Text>
 <Button rounded warning>
 <Text>250 баллов ></Text>
 </Button>
 </View>*/
const styles = {
    container: {
        paddingTop: 15,
        alignItems: "center"
    },
    avatarOuter: {
        width: 112,
        height: 112,
        borderRadius: 112 / 2,
        borderColor: "#d1d3c9",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        marginBottom: 10,
        zIndex: 10000
    },
    avatarProgress: {
        width: 112,
        height: 112,
        borderRadius: 112 / 2,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        zIndex: 10000,
        backgroundColor: 'transparent'
    },
    avatarOuterProgress: {
        width: 112,
        height: 112,
        position: 'absolute',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        zIndex: 10000
    },
    avatarInner: {
        width: 92,
        height: 92,
        borderRadius: 92 / 2,
        backgroundColor: "#7A8187",
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden',
        zIndex: 10000
    },
    editAvatar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 36,
        height: 36,
        borderRadius: 36 / 2,
        borderColor: platform.brandWarningAccent,
        borderWidth: 2,
        backgroundColor: '#2B3034',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomAvatarText: {
        backgroundColor: 'transparent',
        fontSize: 28,
        lineHeight: 35,
        fontFamily: platform.fontFamilyAccentSemibold,

        textAlign: 'center',
        marginBottom: 9
    },
    button: {
        height: 32,
        minWidth: 128

    },
    bonusButton: {
        paddingLeft: 4,
        paddingRight: 4,
        height: 32,
        minWidth: 128
    },
    buttonText: {
        fontSize: 19,
        flex: 1,
        textAlign: "center"
    }
}