import {
    GET_DATA, GET_DATA_FULFILLED, GET_DATA_PENDING, GET_DATA_REJECTED,
    GET_TIME_FULFILLED, GET_TIME_PENDING, GET_TIME_REJECTED
} from "../actions/restaurant";

export type State = {
    restaurants: [],
    timeSheet:[]
}

const initialState = {
    restaurants: [],
    timeSheet:[]
};

export default function (state: State = initialState, action) {
    if (action.type === GET_DATA_FULFILLED) {
        return {
            ...state,
            getDataPending: false,
            restaurants: action.payload.restaurants,
            restaurantsArray: Object.keys(action.payload.restaurants).map((key) => action.payload.restaurants[key])
        };
    }
    if (action.type === GET_DATA_PENDING) {
        return {
            ...state,
            getDataPending: true
        };
    }
    if (action.type === GET_DATA_REJECTED) {
        return {
            ...state,
            getDataPending: false
        };
    }


    if (action.type === GET_TIME_FULFILLED) {
        return {
            ...state,
            getTimePending: false,
            timeSheet: action.payload
        };
    }
    if (action.type === GET_TIME_PENDING) {
        return {
            ...state,
            getTimePending: true,
            timeSheet:[]
        };
    }
    if (action.type === GET_TIME_REJECTED) {
        return {
            ...state,
            getTimePending: false,
            timeSheet:[]
        };
    }

    return state;
}
