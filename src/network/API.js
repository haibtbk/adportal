import ApiManager from './ApiManager'
import Endpoint from './Endpoint'
import { Env } from '@constant/';
import _ from 'lodash';

/**
 * Init API
 */
const API = ApiManager.getInstance(Env.pro) // Init with test env by default. 
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
    const { phone, code, name, avatar } = account
    const params = {
        avatar,
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

API.getSchedulesManager = (params) => {
    return API.instance.get(Endpoint.getSchedulesManager, { params })
}
API.getSchedulesCompany = (params) => {
    return API.instance.get(Endpoint.getSchedulesCompany, { params })
}

API.updateSchedule = (params) => {
    return API.instance.post(Endpoint.updateSchedule, params)
}

API.deleteSchedule = (params) => {
    return API.instance.post(Endpoint.deleteSchedule, params)
}

API.getNews = (params) => {
    return API.instance.get(Endpoint.getNews, { params })
}

API.getEventNews = (params) => {
    return API.instance.get(Endpoint.getEventNews, { params })
}

API.getFileCategories = (params) => {
    return API.instance.get(Endpoint.getFileCategories, { params })
}
API.createSchedule = (isEdit, params) => {
    const url = isEdit ? Endpoint.updateSchedule : Endpoint.createSchedule
    return API.instance.post(url, params)
}

API.getUserUnderControl = (params) => {
    return API.instance.get(Endpoint.getUserUnderControl, { params })
}
API.getRevenue = (params) => {
    return API.instance.get(Endpoint.getRevenue, { params })
}
API.getRevenueCorporation = (params) => {
    return API.instance.get(Endpoint.getRevenueCorporation, { params })
}

API.signup = (params) => {
    return API.instance.post(Endpoint.signup, params)
}

API.getRevenueCompany = (params) => {
    return API.instance.get(Endpoint.getRevenueCompany, { params })
}
API.getRevenueCompanies = (params) => {
    return API.instance.get(Endpoint.getRevenueCompanies, { params })
}

API.getRevenueCorporationVer2 = (params) => {
    return API.instance.get(Endpoint.getRevenueCorporationVer2, { params })
}

API.getScheduleUser = (params) => {
    return API.instance.get(Endpoint.getScheduleUser, {
        params,
    })
}

API.uploadAvatar = (formData) => {

    return API.instance.post(Endpoint.uploadAvatar, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
}

API.uploadFileSchedule = (data) => {
    return API.instance.post(Endpoint.uploadFileSchedule, data);
}

API.scheduleUpdate = (data) => {
    return API.instance.post(Endpoint.scheduleUpdate, data);
}

API.changePassword = (data) => {
    const params = {
        password: data.password,
        password_repeat: data.password_repeat,
        _method: "PUT",
        id: data.id,
        submit: 1
    }
    return API.instance.post(Endpoint.changePassword, params);
}

API.updateAvatar = (avatar) => {
    const params = {
        avatar,
        _method: "put",
        submit: 1
    }
    return API.instance.post(Endpoint.updateProfile, params);
}

API.personRanking = (params) => {
    return API.instance.get(Endpoint.personRanking, { params })
}

API.getOrgUnderControl = (params) => {
    return API.instance.get(Endpoint.getOrgUnderControl, { params })
}

API.getScheduleFromTCT = (params) => {
    return API.instance.get(Endpoint.getScheduleFromTCT, { params })
}
API.getBNNNEvent = (params) => {
    return API.instance.get(Endpoint.getBNNNEvent, { params })
}
API.getTotalBNNNEvent = (params) => {
    return API.instance.get(Endpoint.getTotalBNNNEvent, { params })
}
API.getBNNNRanking = (params) => {
    return API.instance.post(Endpoint.getBNNNRanking, params)
}

API.getAppVersion = () => {
    return API.instance.get(Endpoint.getAppVersion)
}
API.getPersonalData = (params) => {
    return API.instance.get(Endpoint.getPersonalData, { params })
}
API.updateExtraInfo = (params) => {
    return API.instance.post(Endpoint.updateExtraInfo, params)
}
API.getKPI = (params) => {
    return API.instance.get(Endpoint.getKPI, { params })
}
API.getScheduleSale = (params) => {
    return API.instance.get(Endpoint.getScheduleSale, { params })
}

API.createSaleSchedule = (isEdit, params) => {
    const url = isEdit ? Endpoint.updateSaleSchedule : Endpoint.createSaleSchedule
    return API.instance.post(url, params)
}

API.deleteSaleSchedule = (params) => {
    return API.instance.post(Endpoint.deleteSaleSchedule, params)
}

API.getSaleInfo = (params) => {
    return API.instance.get(Endpoint.getSaleInfo, { params })
}


/* Export Component ==================================================================== */
export default API;
