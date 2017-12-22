import {AuthService} from "./api/auth";

export const CLEAR_PENDINGS = 'CLEAR_PENDINGS';

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

export const SET_UID = 'SET_UID';

export const CREATE_DEVICE = 'CREATE_DEVICE';
export const CREATE_DEVICE_PENDING = 'CREATE_DEVICE_PENDING';
export const CREATE_DEVICE_FULFILLED = 'CREATE_DEVICE_FULFILLED';
export const CREATE_DEVICE_REJECTED = 'CREATE_DEVICE_REJECTED';

export const ATTACH_DEVICE = 'ATTACH_DEVICE';
export const ATTACH_DEVICE_PENDING = 'ATTACH_DEVICE_PENDING';
export const ATTACH_DEVICE_FULFILLED = 'ATTACH_DEVICE_FULFILLED';
export const ATTACH_DEVICE_REJECTED = 'ATTACH_DEVICE_REJECTED';


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

export const GET_OPERATION = 'GET_OPERATION';
export const GET_OPERATION_PENDING = 'GET_OPERATION_PENDING';
export const GET_OPERATION_FULFILLED = 'GET_OPERATION_FULFILLED';
export const GET_OPERATION_REJECTED = 'GET_OPERATION_REJECTED';

export const GET_RESULT_OPERATION = 'GET_RESULT_OPERATION';
export const GET_RESULT_OPERATION_PENDING = 'GET_RESULT_OPERATION_PENDING';
export const GET_RESULT_OPERATION_FULFILLED = 'GET_RESULT_OPERATION_FULFILLED';
export const GET_RESULT_OPERATION_REJECTED = 'GET_RESULT_OPERATION_REJECTED';

export const DELETE_OPERATION = 'DELETE_OPERATION';
export const DELETE_OPERATION_PENDING = 'DELETE_OPERATION_PENDING';
export const DELETE_OPERATION_FULFILLED = 'DELETE_OPERATION_FULFILLED';
export const DELETE_OPERATION_REJECTED = 'DELETE_OPERATION_REJECTED';


export const GET_RESERVE = 'GET_RESERVE';
export const GET_RESERVE_PENDING = 'GET_RESERVE_PENDING';
export const GET_RESERVE_FULFILLED = 'GET_RESERVE_FULFILLED';
export const GET_RESERVE_REJECTED = 'GET_RESERVE_REJECTED';

export const CLOSE_TUTORIAL = 'CLOSE_TUTORIAL';

export const UPLOAD_PHOTO = 'UPLOAD_PHOTO';
export const UPLOAD_PHOTO_PENDING = 'UPLOAD_PHOTO_PENDING';
export const UPLOAD_PHOTO_FULFILLED = 'UPLOAD_PHOTO_FULFILLED';
export const UPLOAD_PHOTO_REJECTED = 'UPLOAD_PHOTO_REJECTED';

export const SEND_PUSH_TOKEN = 'SEND_PUSH_TOKEN';
export const SEND_PUSH_TOKEN_PENDING = 'SEND_PUSH_TOKEN_PENDING';
export const SEND_PUSH_TOKEN_FULFILLED = 'SEND_PUSH_TOKEN_FULFILLED';
export const SEND_PUSH_TOKEN_REJECTED = 'SEND_PUSH_TOKEN_REJECTED';

export const CHECK_BILL = 'CHECK_BILL_TOKEN';
export const CHECK_BILL_PENDING = 'CHECK_BILL_PENDING';
export const CHECK_BILL_FULFILLED = 'CHECK_BILL_FULFILLED';
export const CHECK_BILL_REJECTED = 'CHECK_BILL_REJECTED';

export const GET_LIKES = 'GET_LIKES';
export const GET_LIKES_PENDING = 'GET_LIKES_PENDING';
export const GET_LIKES_FULFILLED = 'GET_LIKES_FULFILLED';
export const GET_LIKES_REJECTED = 'GET_LIKES_REJECTED';

export const GET_DISCOUNT_CODE = 'GET_DISCOUNT_CODE';
export const GET_DISCOUNT_CODE_PENDING = 'GET_DISCOUNT_CODE_PENDING';
export const GET_DISCOUNT_CODE_FULFILLED = 'GET_DISCOUNT_CODE_FULFILLED';
export const GET_DISCOUNT_CODE_REJECTED = 'GET_DISCOUNT_CODE_REJECTED';


export const RESET_CODE = 'RESET_CODE';


export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

export function clearPendings() {
    return {
        type: CLEAR_PENDINGS
    };
}


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


export function setUID(uid) {
    return {
        type: SET_UID,
        payload: uid
    }
}

export function createDeviceAction(promise) {
    return {
        type: CREATE_DEVICE,
        payload: promise
    }
}

export const createDevice = (uid, data) => {
    return dispatch => {
        let promise = AuthService.createDevice(uid, data);
        dispatch(createDeviceAction(promise));
        return promise;
    }
};


export function attachDeviceAction(promise) {
    return {
        type: ATTACH_DEVICE,
        payload: promise
    }
}

export const attachDevice = (uid) => {
    return dispatch => {
        let promise = AuthService.attachDevice(uid);
        dispatch(attachDeviceAction(promise));
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

export function getResultAction(promise) {
    return {
        type: GET_RESULT_OPERATION,
        payload: promise
    }
}

export const getResultOperation = (resultId) => {
    return dispatch => {
        let promise = AuthService.getResultOperation(resultId);
        dispatch(getResultAction(promise));
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


export function getOperationAction(promise) {
    return {
        type: GET_OPERATION,
        payload: promise
    }
}

export const getOperation = (operationId) => {
    return dispatch => {
        let promise = AuthService.getOperation(operationId);
        dispatch(getOperationAction(promise));
        return promise;
    }
};

export function deleteOperationAction(promise) {
    return {
        type: DELETE_OPERATION,
        payload: promise
    }
}

export const deleteOperation = (id) => {
    return dispatch => {
        let promise = AuthService.deleteOperation(id);
        dispatch(deleteOperationAction(promise));
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
        type: UPLOAD_PHOTO,
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

function sendPushTokenAction(promise) {
    return {
        type: SEND_TICKET,
        payload: promise
    }
}

export const sendPushToken = (token) => {
    return dispatch => {
        let promise = AuthService.sendPushToken(token);
        dispatch(sendPushTokenAction(promise));
        return promise;
    }
};

function checkBillAction(promise) {
    return {
        type: CHECK_BILL,
        payload: promise
    }
}

export const checkBill = (token) => {
    return dispatch => {
        let promise = AuthService.checkBill(token);
        dispatch(checkBillAction(promise));
        return promise;
    }
};


function getLikesAction(promise) {
    return {
        type: GET_LIKES,
        payload: promise
    }
}

export const getLikes = () => {
    return dispatch => {
        let promise = AuthService.getLikes();
        dispatch(getLikesAction(promise));
        return promise;
    }
};

function getDiscountCodeAction(promise) {
    return {
        type: GET_DISCOUNT_CODE,
        payload: promise
    }
}

export const getDiscountCode = () => {
    return dispatch => {
        let promise = AuthService.getDiscountCode();
        dispatch(getDiscountCodeAction(promise));
        return promise;
    }
};


export function showAlert(message) {
    return {
        type: SHOW_ALERT,
        payload: message
    }
}

export function hideAlert() {
    return {
        type: HIDE_ALERT,
    }
}

export function resetCode() {
    return {
        type: RESET_CODE,
    }
}