import { setWaitingApprove } from '@redux/waitingApprove/actions';

import { API } from '@network'

const countWaitingApprove = (dispatch) => {
    const params = { submit: 1 }
    API.getMenuState(params)
        .then(res => {
            const waitingApproveNum = res?.data?.result?.approve_request_number ?? 0
            dispatch(setWaitingApprove(waitingApproveNum))
        })
        .catch(err => console.log(err))
}

export { countWaitingApprove }