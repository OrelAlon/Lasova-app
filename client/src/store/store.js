import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger";
// import { volunteerReducer } from './reducers/volunteerReducer';
// import { groupReducer } from './reducers/groupReducer';
// import { systemReducer } from './reducers/systemReducer';
// import { authReducer } from './reducers/auth';
// import { volunteeringProgramReducer } from './reducers/volunteeringProgramReducer';
import rootReducer from "./rootReducer";

const middlewares = [thunk];
middlewares.push(logger);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const rootReducer = combineReducers({
//   volunteerReducer,
//   groupReducer,
//   systemReducer,
//   authReducer,
//   volunteeringProgramReducer
// });



export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

