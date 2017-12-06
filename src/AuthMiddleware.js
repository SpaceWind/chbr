import {setSignState, signOut} from "./actions/user";

const authMiddleware = (store) => (next) => (action) => {

    if (action.error && action.payload && (action.payload.status === 401 || action.payload.status === 403)) {
        store.dispatch(setSignState(true));
        store.dispatch(signOut());
    }



    return next(action);
};

export default authMiddleware;