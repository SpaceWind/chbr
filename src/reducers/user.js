import {
    CLEAR_PENDINGS,
    CLOSE_TUTORIAL,
    CONFIRM_CODE_FULFILLED,
    CONFIRM_CODE_PENDING, CONFIRM_CODE_REJECTED, CREATE_DEVICE_FULFILLED, GET_DISCOUNT_CODE,
    GET_DISCOUNT_CODE_FULFILLED, GET_LIKES,
    GET_LIKES_FULFILLED, GET_OPERATION, GET_OPERATION_FULFILLED, GET_OPERATION_PENDING, GET_OPERATION_REJECTED,
    GET_RESERVE,
    GET_RESERVE_FULFILLED,
    GET_RESERVE_PENDING,
    GET_RESERVE_REJECTED, GET_RESULT_OPERATION, GET_RESULT_OPERATION_FULFILLED, GET_RESULT_OPERATION_PENDING,
    GET_RESULT_OPERATION_REJECTED,
    GET_TABLE_RESERVES,
    GET_TABLE_RESERVES_FULFILLED,
    GET_TABLE_RESERVES_PENDING,
    GET_TABLE_RESERVES_REJECTED, GET_USER_DATA,
    GET_USER_DATA_FULFILLED, HIDE_ALERT, RESET_CODE,
    SEND_CODE_FULFILLED, SEND_CODE_PENDING, SEND_CODE_REJECTED, SEND_TICKET, SEND_TICKET_FULFILLED, SEND_TICKET_PENDING,
    SEND_TICKET_REJECTED,
    SET_SIGN_STATE, SET_UID, SHOW_ALERT,
    SHOW_SIGN, SIGN_IN,
    SIGN_OUT, UPDATE_USER_DATA, UPDATE_USER_DATA_FULFILLED
} from '../actions/user';
import moment from "moment";

export type State = {
    name: string,
    phone: string,
    logged: boolean
}

const initialState = {
    name: '',
    phone: '',
    logged: false,
    showSign: true,
    showTutorial: true,
    history: null,
    likes: [],
    uid: null,
    disabledPush: false
};

export default function (state: State = initialState, action) {
    if (action.type === SIGN_IN) {
        return {
            ...state,
            logged: true,
        };
    }
    if (action.type === SIGN_OUT) {
        return {
            ...state,
            token: null,
            phone: '',
            userData: null,
            logged: false,
            isAuth: false,
            likes: []
        };
    }
    if (action.type === SET_SIGN_STATE) {
        return {
            ...state,
            showSign: action.payload
        };
    }
    if (action.type === SEND_CODE_FULFILLED) {
        return {
            ...state,
            sent: moment(),
            token: action.payload.token,
            phone: action.payload.phone,
            sendCodePending: false
        };
    }
    if (action.type === SEND_CODE_PENDING) {
        return {
            ...state,
            sendCodePending: true,
            logged: false
        };
    }
    if (action.type === SEND_CODE_REJECTED) {
        return {
            ...state,
            sendCodePending: false
        };
    }
    if (action.type === RESET_CODE) {
        return {
            ...state,
            sent: null,
            token: null,
            phone: null
        };
    }


    if (action.type === CONFIRM_CODE_PENDING) {
        return {
            ...state,
            isCodeConfirmed: false,
            confirmCodePending: true
        };
    }
    if (action.type === CONFIRM_CODE_FULFILLED) {
        return {
            ...state,
            isCodeConfirmed: true,
            confirmCodePending: false,
            logged: true,
            showSign: false
        };
    }
    if (action.type === CONFIRM_CODE_REJECTED) {
        return {
            ...state,
            isCodeConfirmed: false,
            confirmCodePending: false
        };
    }
    /*if (action.type === GET_USER_DATA) {
        return {
            ...state,
            confirmCodePending: false
        };
    }*/
    if (action.type === GET_USER_DATA_FULFILLED) {
        return {
            ...state,
            userData: action.payload
        };
    }

    if (action.type === SET_UID) {
        return {
            ...state,
            uid: action.payload
        };
    }

    /*if (action.type === UPDATE_USER_DATA) {
        return {
            ...state,
            confirmCodePending: false
        };
    }*/
    if (action.type === UPDATE_USER_DATA_FULFILLED) {


        action.payload.avatar = state.userData.avatar;
        return {
            ...state,
            userData: action.payload,
            disabledPush: action.payload.notifications === 0
        };
    }


    if (action.type === SEND_TICKET_PENDING) {
        return {
            ...state,
            sendTicketPending: true,
        };
    }

    if (action.type === SEND_TICKET_FULFILLED) {
        return {
            ...state,
            sendTicketPending: false,
        };
    }

    if (action.type === SEND_TICKET_REJECTED) {
        return {
            ...state,
            sendTicketPending: false,
        };
    }

    if (action.type === GET_RESERVE_PENDING) {
        return {
            ...state,
            reserve: null,
            isReservePending: true,
        };
    }

    if (action.type === GET_RESERVE_FULFILLED) {
        return {
            ...state,
            reserve: action.payload,
            isReservePending: false,
        };
    }

    if (action.type === GET_RESERVE_REJECTED) {
        return {
            ...state,
            reserve: null,
            isReservePending: false,
        };
    }

    if (action.type === GET_TABLE_RESERVES_PENDING) {
        return {
            ...state,
            getHistoryPending: true,
        };
    }

    if (action.type === GET_TABLE_RESERVES_FULFILLED) {
        return {
            ...state,
            history: action.payload,
            getHistoryPending: false,
        };
    }

    if (action.type === GET_TABLE_RESERVES_REJECTED) {
        return {
            ...state,
            history: null,
            getHistoryPending: false,
        };
    }


    if (action.type === GET_OPERATION_PENDING) {
        return {
            ...state,
            operation: null,
            isOperationPending: true,
        };
    }

    if (action.type === GET_OPERATION_FULFILLED) {
        return {
            ...state,
            operation: action.payload,
            isOperationPending: false,
        };
    }

    if (action.type === GET_OPERATION_REJECTED) {
        return {
            ...state,
            history: null,
            isOperationPending: false
        };
    }

    if (action.type === GET_RESULT_OPERATION_PENDING) {
        return {
            ...state,
            resultOperation: null,
            getResultOperationPending: true,
        };
    }

    if (action.type === GET_RESULT_OPERATION_FULFILLED) {
        return {
            ...state,
            resultOperation: action.payload,
            getResultOperationPending: false,
        };
    }

    if (action.type === GET_RESULT_OPERATION_REJECTED) {
        return {
            ...state,
            resultOperation: null,
            getResultOperationPending: false
        };
    }

    if (action.type === GET_DISCOUNT_CODE) {
        return {
            ...state,
            discountCode: null
        };
    }


    if (action.type === GET_DISCOUNT_CODE_FULFILLED) {
        return {
            ...state,
            discountCode: action.payload
        };
    }

    if (action.type === CLOSE_TUTORIAL) {
        return {
            ...state,
            showTutorial: false,
        };
    }

    if (action.type === SHOW_ALERT) {
        return {
            ...state,
            alert: action.payload
        };
    }
    if (action.type === HIDE_ALERT) {
        return {
            ...state,
            alert: null
        };
    }

    if (action.type === CLEAR_PENDINGS) {
        return {
            ...state,
            isOperationPending: false,
            getHistoryPending: false,
            isReservePending: false,
            sendTicketPending: false,
            confirmCodePending: false,
            sendCodePending: false
        };
    }

    return state;
}
