import axios from 'axios';

import { AppConfig } from '@constant/';
import {Env} from '@constant'
import * as UnauthorizeInterceptor from './interceptors/unauthorize.js';
import * as LogInterceptor from './interceptors/log';
import * as AccessTokenInterceptor from './interceptors/accessToken';

import _ from 'lodash';

const ApiManager = {}

const getInstance = (env) => {
    const instance = axios.create({
        baseURL: AppConfig.API_BASE_URL[env],
        timeout: 30000,
    });

    // Log request & response
    instance.interceptors.request.use(
        LogInterceptor.requestLog,
        LogInterceptor.requestError,
    );

    instance.interceptors.response.use(
        LogInterceptor.responseLog,
        LogInterceptor.responseError,
    );

    // Response interceptors
    instance.interceptors.response.use(
        UnauthorizeInterceptor.onFullfilled,
        error => {
            // Pass axiosInstance to retry request. Using for case need to refresh token
            return UnauthorizeInterceptor.onRejected(instance, error)
        }
    );

    // Request interceptors
    instance.interceptors.request.use(
        AccessTokenInterceptor.addExtraInfo,
        AccessTokenInterceptor.onRejected
    );
    return instance;
}

ApiManager.getInstance = (env = Env.test) => {
    const axiosIntance = getInstance(env)
    return { env: env, instance: axiosIntance }
}

/* Export Component ==================================================================== */
export default ApiManager;
