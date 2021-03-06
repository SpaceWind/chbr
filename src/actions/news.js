import {NewsService} from "./api/news";
export const GET_NEWS = 'GET_NEWS';
export const GET_NEWS_PENDING = 'GET_NEWS_PENDING';
export const GET_NEWS_FULFILLED = 'GET_NEWS_FULFILLED';
export const GET_NEWS_REJECTED = 'GET_NEWS_REJECTED';

export const GET_ONE_NEWS = 'GET_ONE_NEWS';
export const GET_ONE_NEWS_PENDING = 'GET_ONE_NEWS_PENDING';
export const GET_ONE_NEWS_FULFILLED = 'GET_ONE_NEWS_FULFILLED';
export const GET_ONE_NEWS_REJECTED = 'GET_ONE_NEWS_REJECTED';



const delay = (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
);

export function getNewsAction(promise) {
    return {
        type: GET_NEWS,
        payload: promise
    }
}

export const getNews = (restaurantId) => {
    return dispatch => {
        let promise = NewsService.getNews(restaurantId);
        dispatch(getNewsAction(promise));
        return promise;
    }
};


export function getOneNewsAction(promise) {
    return {
        type: GET_ONE_NEWS,
        payload: promise
    }
}

export const getOneNews = (newsId) => {
    return dispatch => {
        let promise = NewsService.getOneNews(newsId);
        dispatch(getOneNewsAction(promise));
        return promise;
    }
};
