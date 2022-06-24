import ActionType from '../ActionType'
// Set initial state
const initialState = {};

export default function setLocalize(state = initialState, action) {
  switch (action.type) {
    case ActionType.SET_LOCALIZE:
      return {
        ...state,
        ...action.data,
      }
    
    default:
      return state;
  }
}