const initialState = {};

export default function refresh(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH':
      return {
        ...state,
        event: action.data,
      }

    default:
      return state;
  }
}