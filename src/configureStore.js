import {AsyncStorage} from 'react-native';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {persistStore} from 'redux-persist';
import reducer from './reducers';
import promise from './promise';
import promiseMiddleware from 'redux-promise-middleware';
import {autoRehydrate} from "redux-persist";

export default function configureStore(onCompletion: () => void): any {
    const enhancer = compose(
        applyMiddleware(thunk, promiseMiddleware()),
       autoRehydrate(),
        /*devTools({
            name: 'nativestarterkit', realtime: true,
        })*/
    );

    const store = createStore(reducer, enhancer);
    persistStore(store, {storage: AsyncStorage}, onCompletion);

    return store;
}
