import platform from "../../native-base-theme/variables/platform";
//import {Constants} from 'expo';
import {Platform} from "react-native";

export const BaseNavigationBarStyle = {
    headerStyle: {

        backgroundColor: "rgb(44, 47, 51)",
        minHeight: Platform.OS === "ios" ? 44 : (56),


        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 7,
        shadowRadius: 8,
        borderBottomWidth: 0,
        borderWidth: 0

    },
    headerTitleStyle: {
        fontSize: 24,
        fontFamily: platform.fontFamilyAccent,
        fontWeight:Platform.OS === "ios"? "800":'normal',
        marginHorizontal: 0
    },
    headerTintColor: '#FFF'
}