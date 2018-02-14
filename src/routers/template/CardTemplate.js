
import DiscountPage from "../../components/Cards/DiscountPage/index";
import HowWorksPage from "../../components/Common/HowWorksPage/index";
export default CardTemplate ={
    MayCardPage: {
        screen: DiscountPage,
        navigationOptions: props => ({
            title: 'Моя карта',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode: 'locked-closed'
        })
    },
    HowWorksPage: {
        screen: HowWorksPage,
        navigationOptions: props => ({
            title: 'Как это работает',
            headerBackTitleStyle: {
                color: "transparent"
            },
            drawerLockMode: 'locked-closed'
        })
    },
}