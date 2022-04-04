import { LocalStorage } from '@data';
/*
Client ID: cImQgyuF28A4RIiZV2WZ6Dkalr5ZNI2C
Client Secret: IfNMhBRDS3PYxeZ0

ClientEncoded = base64Encoder(clientIdValue:clientSecretValue)
BASIC_AUTHENTICATION = 'Basic ' + ClientEncoded
*/
const BASIC_AUTHENTICATION = 'Basic Y0ltUWd5dUYyOEE0UklpWlYyV1o2RGthbHI1Wk5JMkM6SWZOTWhCUkRTM1BZeGVaMA=='

const ACCESS_TOKEN = 'accessToken'
const REFRESING_TIME = 30  // in second.

const AccessTokenManager = {
    accessToken: null,
    expiresIn: null,

    refreshToken: null,
    refreshTokenExpiresIn: null,

    // The time token will be saved. 
    // Token invalid if: tokenStartTime +  expiresIn < currentTime
    tokenStartTime: null
};


AccessTokenManager.initializeAndValidate = () => {
    return new Promise((resolve, reject) => {
        LocalStorage.get(ACCESS_TOKEN, (error, result) => {
            if (error) {
                return reject(error)
            }
            if (result == null) {
                return reject(false)
            }

            const savedData = JSON.parse(result)

            AccessTokenManager.accessToken = savedData.accessToken;

            AccessTokenManager.validate()
                .then(success => {
                    resolve(success)
                })
                .catch(error => {
                    reject(error)
                })
        });
    })
};


AccessTokenManager.validate = () => {

    if (AccessTokenManager.accessToken == null) {
        return Promise.reject(false)
    }

    return Promise.resolve(true)
}

AccessTokenManager.saveAccessToken = (token) => {

    AccessTokenManager.accessToken = token;

    const savedData = {
        accessToken: AccessTokenManager.accessToken,
    }
    LocalStorage.set(ACCESS_TOKEN, JSON.stringify(savedData))
};


AccessTokenManager.clear = () => {
    AccessTokenManager.accessToken = null

    LocalStorage.remove(ACCESS_TOKEN);
};

AccessTokenManager.getAccessToken = () => {
    return AccessTokenManager.accessToken;
};


AccessTokenManager.getBearerAuthentication = () => {
    return 'Bearer ' + AccessTokenManager.accessToken
};

AccessTokenManager.addBasicAuthentication = (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        'Authorization': BASIC_AUTHENTICATION,
        ...config.headers,
    };

    return config;
};

AccessTokenManager.addBearerAuthentication = (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        'Authorization': AccessTokenManager.getBearerAuthentication(),
        ...config.headers,
    };

    return config;
};

export default AccessTokenManager;