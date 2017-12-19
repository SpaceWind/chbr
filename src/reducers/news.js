import {
    GET_NEWS, GET_NEWS_FULFILLED, GET_NEWS_PENDING, GET_NEWS_REJECTED, GET_ONE_NEWS, GET_ONE_NEWS_FULFILLED,
    GET_ONE_NEWS_PENDING,
    GET_ONE_NEWS_REJECTED
} from "../actions/news";

export type State = {
    news: [],
    getNewsPending: boolean
}

const initialState = {
    news: [],
    getNewsPending: false
};

export default function (state: State = initialState, action) {
    if (action.type === GET_NEWS_FULFILLED) {
        return {
            ...state,
            getNewsPending: false,
            news: action.payload.list,
            hash: action.payload._hash,
        };
    }
    if (action.type === GET_NEWS_PENDING) {
        return {
            ...state,
            getNewsPending: true
        };
    }
    if (action.type === GET_NEWS_REJECTED) {
        return {
            ...state,
            getNewsPending: false
        };
    }


    if (action.type === GET_ONE_NEWS_PENDING) {
        return {
            ...state,
            oneNews:null,
            getOneNewsPending: true
        };
    }
    if (action.type === GET_ONE_NEWS_FULFILLED) {
        return {
            ...state,
            oneNews:action.payload,
            getOneNewsPending: false
        };
    }

    if (action.type === GET_ONE_NEWS_REJECTED) {
        return {
            ...state,
            getOneNewsPending: false
        };
    }


    return state;
}
