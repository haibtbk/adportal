const initialState = {};

export default function waitingApproveReducer(state = initialState, action) {
  switch (action.type) {
    case 'WAITING_APPROVE':
      return {
        ...state,
        number: action.data,
      }

    default:
      return state;
  }
}