export function setWaitingApprove(number) {
  return async (dispatch) => {
    return dispatch({
      type: 'WAITING_APPROVE',
      data: number,
    })
  }
}