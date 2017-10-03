import {AuthService} from "./api/auth";

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_SIGN_STATE = 'SET_SIGN_STATE';

export const SEND_CODE = 'SEND_CODE';
export const SEND_CODE_PENDING = 'SEND_CODE_PENDING';
export const SEND_CODE_FULFILLED = 'SEND_CODE_FULFILLED';
export const SEND_CODE_REJECTED = 'SEND_CODE_REJECTED';

export const CONFIRM_CODE = 'CONFIRM_CODE';
export const CONFIRM_CODE_PENDING = 'CONFIRM_CODE_PENDING';
export const CONFIRM_CODE_FULFILLED = 'CONFIRM_CODE_FULFILLED';
export const CONFIRM_CODE_REJECTED = 'CONFIRM_CODE_REJECTED';

export const GET_USER_DATA = 'GET_USER_DATA';
export const GET_USER_DATA_PENDING = 'GET_USER_DATA_PENDING';
export const GET_USER_DATA_FULFILLED = 'GET_USER_DATA_FULFILLED';
export const GET_USER_DATA_REJECTED = 'GET_USER_DATA_REJECTED';

export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const UPDATE_USER_DATA_PENDING = 'UPDATE_USER_DATA_PENDING';
export const UPDATE_USER_DATA_FULFILLED = 'UPDATE_USER_DATA_FULFILLED';
export const UPDATE_USER_DATA_REJECTED = 'UPDATE_USER_DATA_REJECTED';

export const SEND_TICKET = 'SEND_TICKET';
export const SEND_TICKET_PENDING = 'SEND_TICKET_PENDING';
export const SEND_TICKET_FULFILLED = 'SEND_TICKET_FULFILLED';
export const SEND_TICKET_REJECTED = 'SEND_TICKET_REJECTED';

export const GET_TABLE_RESERVES = 'GET_TABLE_RESERVES';
export const GET_TABLE_RESERVES_PENDING = 'GET_TABLE_RESERVES_PENDING';
export const GET_TABLE_RESERVES_FULFILLED = 'GET_TABLE_RESERVES_FULFILLED';
export const GET_TABLE_RESERVES_REJECTED = 'GET_TABLE_RESERVES_REJECTED';

export const GET_RESERVE = 'GET_RESERVE';
export const GET_RESERVE_PENDING = 'GET_RESERVE_PENDING';
export const GET_RESERVE_FULFILLED = 'GET_RESERVE_FULFILLED';
export const GET_RESERVE_REJECTED = 'GET_RESERVE_REJECTED';

export const CLOSE_TUTORIAL = 'CLOSE_TUTORIAL';

export const UPLOAD_PHOTO = 'UPLOAD_PHOTO';
export const UPLOAD_PHOTO_PENDING = 'UPLOAD_PHOTO_PENDING';
export const UPLOAD_PHOTO_FULFILLED = 'UPLOAD_PHOTO_FULFILLED';
export const UPLOAD_PHOTO_REJECTED = 'UPLOAD_PHOTO_REJECTED';

const delay = (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
);

export function signIn() {
    return {
        type: SIGN_IN
    };
}

export function signOut() {
    return {
        type: SIGN_OUT
    };
}

export function setSignState(state) {
    return {
        type: SET_SIGN_STATE,
        payload: state
    };
}

export function sendCodeAction(promise) {
    return {
        type: SEND_CODE,
        payload: promise
    }
}

export const sendCode = (number) => {
    return dispatch => {
        let promise = AuthService.sendCode(number);
        dispatch(sendCodeAction(promise));
        return promise;
    }
};

export function confirmCodeAction(promise) {
    return {
        type: CONFIRM_CODE,
        payload: promise
    }
}

export const confirmCode = (code) => {
    return dispatch => {
        let promise = AuthService.confirmCode(code);
        dispatch(confirmCodeAction(promise));
        return promise;
    }
};

export function getUserDataAction(promise) {
    return {
        type: GET_USER_DATA,
        payload: promise
    }
}

export const getUserData = () => {
    return dispatch => {
        let promise = AuthService.getUserData();
        dispatch(getUserDataAction(promise));
        return promise;
    }
};

export function updateUserDataAction(promise) {
    return {
        type: UPDATE_USER_DATA,
        payload: promise
    }
}

export const updateUserData = (data) => {
    return dispatch => {
        let promise = AuthService.updateUserData(data);
        dispatch(updateUserDataAction(promise));
        return promise;
    }
};

export function sendTicketAction(promise) {
    return {
        type: SEND_TICKET,
        payload: promise
    }
}

export const sendTicket = (data) => {
    return dispatch => {
        let promise = AuthService.sendTicket(data);
        dispatch(sendTicketAction(promise));
        return promise;
    }
};

export function getTableReservesAction(promise) {
    return {
        type: GET_TABLE_RESERVES,
        payload: promise
    }
}

export const getTableReserves = () => {
    return dispatch => {
        let promise = AuthService.getTableReserves();
        dispatch(getTableReservesAction(promise));
        return promise;
    }
};

function getReserveAction(promise) {
    return {
        type: GET_RESERVE,
        payload: promise
    }
}

export const getReserve = (restaurantId, reserveId) => {
    return dispatch => {
        let promise = AuthService.getReserve(restaurantId, reserveId);
        dispatch(getReserveAction(promise));
        return promise;
    }
};

export function closeTutorial(promise) {
    return {
        type: CLOSE_TUTORIAL
    }
}

function uploadPhotoAction(promise) {
    return {
        type: SEND_TICKET,
        payload: promise
    }
}

export const uploadPhoto = (data) => {
    return dispatch => {
        let promise = AuthService.uploadPhoto(data);
        dispatch(uploadPhotoAction(promise));
        return promise;
    }
};