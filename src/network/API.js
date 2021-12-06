import ApiManager from './ApiManager'
import Endpoint from './Endpoint'

import { Env } from '@constant/';

import _ from 'lodash';
import { sprintf } from 'sprintf-js'

/**
 * Init API
 */
const API = ApiManager.getInstance(Env.test) // Init with test env by default. 
/**
 * Auth API
 */
API.login = (params) => {
    return API.instance.post(Endpoint.LOGIN, params);
};

API.getProfile = () => {
    return API.instance.get(Endpoint.getProfile)
}

API.updateProfile = (account) => {
    const { phone, code, name } = account
    const params = {
        phone,
        code,
        name,
        _method: 'PUT'
    }
    return API.instance.post(Endpoint.updateProfile, params)
}

API.updateDeviceInfo = (data) => {
    const { action, device_type, device_id, fcm_token } = data
    params = {
        action,
        device_type,
        device_id,
        fcm_token,
        _method: "PUT"
    }
    return API.instance.post(Endpoint.updateDeviceInfo, params)

}

/* Export Component ==================================================================== */
export default API;
