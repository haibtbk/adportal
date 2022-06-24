import user from './user/reducer'
import refresh from './refresh/reducer';
import waitingApprove from './waitingApprove/reducer'
import localize from './localize/reducer'
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    localize,
    user,
    refresh,
    waitingApprove
})

// Setup root reducer
const rootReducer = (state, action) => {
    const newState = (action.type === 'USER_LOGOUT') ? undefined : state;
    return appReducer(newState, action);
  };
  export default rootReducer;