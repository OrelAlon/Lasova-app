import { combineReducers } from "redux";
import { volunteerReducer } from './reducers/volunteerReducer';
import { groupReducer } from './reducers/groupReducer';
import { systemReducer } from './reducers/systemReducer';
import { authReducer } from './reducers/auth';
import { volunteeringProgramReducer } from './reducers/volunteeringProgramReducer';

const appReducer = combineReducers({
    volunteerReducer,
    groupReducer,
    systemReducer,
    authReducer,
    volunteeringProgramReducer
  });
  

// reset the store in case the user clicks on logout
const rootReducer = (state, action) => {
    if (action.type === 'RESET_APP') {
      state = undefined;
    }
  
    return appReducer(state, action);
  }

export default rootReducer;