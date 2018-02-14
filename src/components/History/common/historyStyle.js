import {Platform, Dimensions} from "react-native";
//import {Constants} from "expo";

const historyStyles = {
        scrollContainer: {
            height: Dimensions.get('window').height -
            (Platform.OS === "ios" ? 64 : (56 + 30/*Constants.statusBarHeight*/))
        },
        minScrollContainer: {
            minHeight: Dimensions.get('window').height -
            (Platform.OS === "ios" ? 64 : (56 + 30/*Constants.statusBarHeight*/))
        }
    }
;
export default historyStyles;