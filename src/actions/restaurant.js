/*@flow*/
import {RestaurantService} from "./api/restaurant";

export const GET_DATA = 'GET_DATA';
export const GET_DATA_PENDING = 'GET_DATA_PENDING';
export const GET_DATA_FULFILLED = 'GET_DATA_FULFILLED';
export const GET_DATA_REJECTED = 'GET_DATA_REJECTED';

export const GET_TIME = 'GET_TIME';
export const GET_TIME_PENDING = 'GET_TIME_PENDING';
export const GET_TIME_FULFILLED = 'GET_TIME_FULFILLED';
export const GET_TIME_REJECTED = 'GET_TIME_REJECTED';


export const RESERVE = 'RESERVE';
export const RESERVE_PENDING = 'RESERVE_PENDING';
export const RESERVE_FULFILLED = 'RESERVE_FULFILLED';
export const RESERVE_REJECTED = 'RESERVE_REJECTED';

export const CANCEL_RESERVE = 'CANCEL_RESERVE';
export const CANCEL_RESERVE_PENDING = 'CANCEL_RESERVE_PENDING';
export const CANCEL_RESERVE_FULFILLED = 'CANCEL_RESERVE_FULFILLED';
export const CANCEL_RESERVE_REJECTED = 'CANCEL_RESERVE_REJECTED';

export const BUY_BY_BONUS = 'BUY_BY_BONUS';
export const BUY_BY_BONUS_PENDING = 'BUY_BY_BONUS_PENDING';
export const BUY_BY_BONUS_FULFILLED = 'BUY_BY_BONUS_FULFILLED';
export const BUY_BY_BONUS_REJECTED = 'BUY_BY_BONUS_REJECTED';


export const LIKE = 'LIKE';
export const LIKE_PENDING = 'LIKE_PENDING';
export const LIKE_FULFILLED = 'LIKE_FULFILLED';
export const LIKE_REJECTED = 'LIKE_REJECTED';

export const GET_DISH = 'GET_DISH';
export const GET_DISH_PENDING = 'GET_DISH_PENDING';
export const GET_DISH_FULFILLED = 'GET_DISH_FULFILLED';
export const GET_DISH_REJECTED = 'GET_DISH_REJECTED';


export function getDataAction(promise) {
    return {
        type: GET_DATA,
        payload: promise
    }
}

export const getRestaurants = (_hash) => {
    return dispatch => {
        let promise = RestaurantService.getData(_hash);
        dispatch(getDataAction(promise));
        return promise;
    }
};


export function getTimeAction(promise) {
    return {
        type: GET_TIME,
        payload: promise
    }
}

export const getTime = (restaurantId, data: { people_quantity: string, timestamp: string }) => {
    return dispatch => {
        let promise = RestaurantService.getTime(restaurantId, data);
        dispatch(getTimeAction(promise));
        return promise;
    }
};

export function reserveAction(promise) {
    return {
        type: RESERVE,
        payload: promise
    }
}

export const reserve = (restaurantId, data: { people_quantity: string, timestamp: string, comment: string }) => {
    return dispatch => {
        let promise = RestaurantService.reserve(restaurantId, data);
        dispatch(reserveAction(promise));
        return promise;
    }
};

export function cancelReserveAction(promise) {
    return {
        type: CANCEL_RESERVE,
        payload: promise
    }
}

export const cancelReserve = (restaurantId, reserveid) => {
    return dispatch => {
        let promise = RestaurantService.cancelReserve(restaurantId, reserveid);
        dispatch(cancelReserveAction(promise));
        return promise;
    }
};


export function buyByBonusAction(promise) {
    return {
        type: BUY_BY_BONUS,
        payload: promise
    }
}

export const buyByBonus = (restaurantId, dishId) => {
    return dispatch => {
        let promise = RestaurantService.buyByBonus(restaurantId, dishId);
        dispatch(buyByBonusAction(promise));
        return promise;
    }
};

export function likeDishAction(promise) {
    return {
        type: LIKE,
        payload: promise
    }
}

export const likeDish = (restaurantId, categoryId, dishId, like,deviceId) => {
    return dispatch => {
        let promise = RestaurantService.likeDish(restaurantId, categoryId, dishId, like,deviceId);
        dispatch(likeDishAction(promise));
        return promise;
    }
};

export function getDishAction(promise) {
    return {
        type: GET_DISH,
        payload: promise
    }
}

export const getDish = (restaurantId, categoryId, dishId,deviceId) => {
    return dispatch => {
        let promise = RestaurantService.getDish(restaurantId, categoryId, dishId,deviceId);
        dispatch(getDishAction(promise));
        return promise;
    }
};



