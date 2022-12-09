import { createStore, compose, combineReducers, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { authReducer } from './reducers/authReducer';
import { messengerReducer } from './reducers/messengerReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    messenger: messengerReducer
})

const middleware = [thunkMiddleware]

const store = createStore(rootReducer, compose(applyMiddleware(...middleware)//support middleware
,
//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//support the Reduc DevTools extension of Chrome
//have to comment it out if not cant open the app with 2 browers at da same time
));

export default store; 