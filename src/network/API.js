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

API.confirmRequest = (params) => {
    return API.instance.post(Endpoint.confirmRequest, params)
}

API.getRequestList = (params) => {
    return API.instance.get(Endpoint.getListRequest, { params })
}

API.getMenuState = (params) => {
    return API.instance.get(Endpoint.getMenuState, { params })
}

API.searchFiles = (params) => {
    return API.instance.get(Endpoint.searchFiles, { params })
}

API.downloadFile = (params) => {
    return API.instance.post(Endpoint.downloadFile, params)
}

API.getDashboardInfo = () => {
    const params = { submit: 1 }
    return API.instance.get(Endpoint.getDashboardInfo, { params })
}

API.getSchedules = (params) => {
    return API.instance.get(Endpoint.getSchedules, { params })
}

API.getSchedulesCompamny = (params) => {
    return API.instance.get(Endpoint.getSchedulesCompamny, { params })
}

API.updateSchedule = (params) => {
    return API.instance.post(Endpoint.updateSchedule, params)
}

API.getNews = (params) => {
    return API.instance.post(Endpoint.getNews, params)
}

API.getEventNews = (params) => {
    return API.instance.post(Endpoint.getEventNews, params)
}
/* Export Component ==================================================================== */
export default API;
