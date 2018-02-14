/*@flow*/
import {ADD_DISH, CLEAR_BASKET, DELETE_DISH, INIT_BASKET, REMOVE_DISH} from "../actions/billing";

export type State = {
    dishes: [],
    restaurantId: string
}

const initialState = {
    dishes: [],
    restaurantId: null
};

export default function (state: State = initialState, action) {

    if (action.type === ADD_DISH) {

        let dishExist = state.dishes.find(dish => dish.id === action.payload.id);
        if (dishExist) {
            dishExist.count = dishExist.count + 1;
        }
        else {
            dishExist = {
                id: action.payload.id,
                count: 1,
                price: action.payload.price
            };
            state.dishes.push(dishExist);
        }
        return {
            ...state,
            dishes: Object.assign([], state.dishes)
        }


    }

    if (action.type === REMOVE_DISH) {
        let dishExist = state.dishes.find(dish => dish.id === action.payload.id);
        if (dishExist) {
            if (dishExist.count > 1) {
                dishExist.count = dishExist.count - 1;
            }
            else {
                state.dishes.splice(state.dishes.indexOf(dishExist), 1);
            }
            return {
                ...state,
                dishes: Object.assign([], state.dishes)
            }
        }
    }

    if (action.type === DELETE_DISH) {
        let dishExist = state.dishes.find(dish => dish.id === action.payload.id);
        if (dishExist) {
            state.dishes.splice(state.dishes.indexOf(dishExist), 1);
            return {
                ...state,
                dishes: Object.assign([], state.dishes)
            }
        }
    }

    if (action.type === CLEAR_BASKET) {
        return {
            ...state,
            dishes: [],
            restaurantId: null
        };
    }

    if (action.type === INIT_BASKET) {
        return {
            ...state,
            dishes: [],
            restaurantId: action.payload.restaurantId
        };
    }

    return state;
}
