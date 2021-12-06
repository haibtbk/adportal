import Endpoint from '../Endpoint'

const UnauthorizeStatusCode = 401;

export function onFullfilled(response) {
    //check if server response error
    if (response.data.error) {
        return Promise.reject(response);
    }
    return Promise.resolve(response);
}

export function onRejected(axiosIntance, error) {
    const originalRequest = error.config;
    const response = error.response;

    // Return any error which is not due to authentication back to the calling service 
    // or if user login failed.
    if (!response || response.status !== UnauthorizeStatusCode || originalRequest.url.includes(Endpoint.LOGIN)) {
        return Promise.reject(error);
    } else{
        console.log("Refresh token error:" + refreshTokenError)
            // Actions.replace("login")
    }
}