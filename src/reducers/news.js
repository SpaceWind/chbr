import {GET_NEWS, GET_NEWS_FULFILLED, GET_NEWS_PENDING, GET_NEWS_REJECTED} from "../actions/news";

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

    return state;
}
