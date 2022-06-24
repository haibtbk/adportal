import ActionType from '../ActionType'

export default function setLocalize(localize) {
  return async (dispatch) => {
    return dispatch({
      type: ActionType.SET_LOCALIZE,
      data: localize,
    })
  }
}