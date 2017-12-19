import {setSignState, showAlert, signOut} from "./actions/user";

const authMiddleware = (store) => (next) => (action) => {

    if (action.error && action.payload) {


        if (action.payload.body && action.payload.body.error === 'Current user is banned.') {
            action.payload.notShowAlert = true;
            store.dispatch(showAlert({
                title: "Ваш номер заблокирован",
                message: "Свяжитесь с администрацией ресторана."
            }));
            store.dispatch(setSignState(true));
            store.dispatch(signOut());

        }

        if (action.payload.status === 401) {
            store.dispatch(setSignState(true));
            store.dispatch(signOut());
        }


    }


    return next(action);
};

export default authMiddleware;