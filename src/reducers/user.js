import {
    CLOSE_TUTORIAL,
    CONFIRM_CODE_FULFILLED,
    CONFIRM_CODE_PENDING, CONFIRM_CODE_REJECTED, GET_DISCOUNT_CODE, GET_DISCOUNT_CODE_FULFILLED, GET_LIKES,
    GET_LIKES_FULFILLED, GET_OPERATION, GET_OPERATION_FULFILLED, GET_OPERATION_PENDING, GET_OPERATION_REJECTED,
    GET_RESERVE,
    GET_RESERVE_FULFILLED,
    GET_RESERVE_PENDING,
    GET_RESERVE_REJECTED,
    GET_TABLE_RESERVES,
    GET_TABLE_RESERVES_FULFILLED,
    GET_TABLE_RESERVES_PENDING,
    GET_TABLE_RESERVES_REJECTED, GET_USER_DATA,
    GET_USER_DATA_FULFILLED,
    SEND_CODE_FULFILLED, SEND_CODE_PENDING, SEND_CODE_REJECTED, SEND_TICKET, SEND_TICKET_FULFILLED, SEND_TICKET_PENDING,
    SEND_TICKET_REJECTED,
    SET_SIGN_STATE, SET_UID,
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
    uid: null
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
    if (action.type === CONFIRM_CODE_FULFILLED) {
        return {
            ...state,
            sent: moment(),
            confirmCodePending: false,
            logged: true,
            showSign: false
        };
    }
    if (action.type === CONFIRM_CODE_PENDING) {
        return {
            ...state,
            confirmCodePending: true
        };
    }
    if (action.type === CONFIRM_CODE_REJECTED) {
        return {
            ...state,
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
            userData: action.payload
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

    return state;
}
