import platform from "../../native-base-theme/variables/platform";
//import {Constants} from 'expo';
import {Platform} from "react-native";

export const BaseNavigationBarStyle = {
    headerStyle: {

        backgroundColor: "rgb(44, 47, 51)",
        height: Platform.OS === "ios" ? 64 : (56),
        paddingTop: Platform.OS === "ios" ? 20 : 0,


        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 7,
        shadowRadius: 8

    },
    headerTitleStyle: {
        fontSize: 24,
        fontFamily: platform.fontFamilyAccent,
        fontWeight:Platform.OS === "ios"? "800":'normal',
        marginHorizontal: 0
    },
    headerTintColor: '#FFF'
}