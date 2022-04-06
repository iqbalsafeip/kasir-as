import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { mainReducer } from './reducers';

const rootReducer = combineReducers({
    mainReducer : mainReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;