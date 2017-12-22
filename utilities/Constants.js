import {Platform, NativeModules, Dimensions} from 'react-native';

const {StatusBarManager} = NativeModules;

const Constants = {
    STATUSBAR_HEIGHT: Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT,
    NAVBARHEIGHT: (Platform.OS === "ios" ? 64 : 56),
    BODY_HEIGHT: Dimensions.get('window').height -
    (Platform.OS === "ios" ? 64 : 56 + StatusBarManager.HEIGHT)
};

export default Constants;