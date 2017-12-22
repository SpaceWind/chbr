import {
    BUY_BY_BONUS_FULFILLED, BUY_BY_BONUS_PENDING,
    BUY_BY_BONUS_REJECTED,
    GET_DATA, GET_DATA_FULFILLED, GET_DATA_PENDING, GET_DATA_REJECTED, GET_DISH, GET_DISH_FULFILLED, GET_DISH_PENDING,
    GET_DISH_REJECTED,
    GET_TIME_FULFILLED, GET_TIME_PENDING, GET_TIME_REJECTED, LIKE, LIKE_FULFILLED, LIKE_PENDING, LIKE_REJECTED
} from "../actions/restaurant";
import {CLEAR_PENDINGS} from "../actions/user";

export type State = {
    restaurants: [],
    timeSheet: []
}

const initialState = {
    restaurants: [],
    timeSheet: []
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
            timeSheet: []
        };
    }
    if (action.type === GET_TIME_REJECTED) {
        return {
            ...state,
            getTimePending: false,
            timeSheet: []
        };
    }


    if (action.type === GET_DISH_FULFILLED) {
        return {
            ...state,
            currentDish: action.payload,
            currentDishPending: false
        };
    }

    if (action.type === GET_DISH_PENDING) {
        return {
            ...state,
            currentDishPending: true,
            currentDish: null
        };
    }

    if (action.type === GET_DISH_REJECTED) {
        return {
            ...state,
            currentDishPending: false
        };
    }


    if (action.type === BUY_BY_BONUS_PENDING) {
        return {
            ...state,
            buyByBonusPending: true
        };
    }
    if (action.type === BUY_BY_BONUS_FULFILLED) {
        return {
            ...state,
            buyByBonusPending: false
        };
    }
    if (action.type === BUY_BY_BONUS_REJECTED) {
        return {
            ...state,
            buyByBonusPending: false
        };
    }


    if (action.type === LIKE_FULFILLED) {
        let newDish = {
            ...state.сurrentDish,
            current_client_like_it: action.payload.like,
            likes: state.currentDish.likes + (action.payload.like ? 1 : -1)
        };
        return {
            ...state,
            currentDish: newDish,
            likePending: false
        };
    }

    if (action.type === LIKE_PENDING) {
        return {
            ...state,
            likePending: true
        };
    }

    if (action.type === LIKE_REJECTED) {
        return {
            ...state,
            likePending: false
        };
    }

    if (action.type === CLEAR_PENDINGS) {
        return {
            ...state,
            likePending: false,
            currentDishPending: false,
            getTimePending: false,
            getDataPending: false
        };
    }


    return state;
}

