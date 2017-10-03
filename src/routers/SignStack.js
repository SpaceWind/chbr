import {StackNavigator} from 'react-navigation';
import SignFirstStep from "../components/SignIn/SignFirstStep/index";
import SignSecondStep from "../components/SignIn/SignSecondStep/index";
import platform from "../../native-base-theme/variables/platform";


export default SignStack = StackNavigator({
    SignFirst: {
        screen: SignFirstStep,
        navigationOptions: {
            header:null
        }
    },
    SignSecond: {
        screen: SignSecondStep,
        navigationOptions: {
            title: "Подтверждение"
        }
    },
},{
    cardStyle:{
        backgroundColor:'transparent',
    },
    navigationOptions:{
        headerStyle:{
            position: 'absolute',
            backgroundColor: 'transparent',
            zIndex: 100,
            top: 0,
            left: 0,
            right: 0,
            borderBottomWidth: 0
        },
        headerTitleStyle: {
            fontSize: 24,
            fontFamily:platform.fontFamily
        },
        headerTintColor:'#FFF'
    }
});


export const signStackStyle={
    flex:1,
    width: null,
    height: null,
};

