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



