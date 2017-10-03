import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import user from "./user";
import restaurant from "./restaurant";
import news from "./news";
import billing from "./billing";

export default combineReducers({
    form: formReducer,
    restaurant,
    user,
    news,
    billing
});

