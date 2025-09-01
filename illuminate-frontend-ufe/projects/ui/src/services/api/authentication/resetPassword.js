import ufeApi from 'services/api/ufeApi';
const ATG_URL = '/api/secure/resetPassword';
const AUTH_URL = '/api/auth/v1/resetPassword';
const SDN_URL = '/gway/v1/dotcom/auth/v1/resetPassword';
const SDN_URL_V2 = '/gway/v1/dotcom/auth/v2/resetPassword';
import authUtils from 'utils/Authentication';
import RCPSCookies from 'utils/RCPSCookies';
import NGPCookies from 'utils/NGPCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Reset+Password+API

async function resetPasswordByLogin(email, source) {
    const { isAuthServiceResetPassEnabled } = Sephora.configurationSettings;
    const isNGPUserRegistrationEnabled = NGPCookies.isNGPUserRegistrationEnabled();

    let URL = ATG_URL;
    let headers = {};

    if (isAuthServiceResetPassEnabled) {
        URL = AUTH_URL;
        headers = {
            'Content-type': 'application/json',
            'x-requested-source': 'web'
        };
    }

    if (RCPSCookies.isRCPSAuthEnabled()) {
        URL = SDN_URL;
        headers.deviceId = await authUtils.getFingerPrint();
    }

    if (isNGPUserRegistrationEnabled) {
        URL = SDN_URL_V2;
    }

    return ufeApi
        .makeRequest(URL, {
            method: 'POST',
            body: JSON.stringify({
                type: 'email',
                email,
                source: source || undefined
            }),
            headers
        })
        .then(data => {
            return data.errorCode || data.errors ? Promise.reject(data) : data;
        })
        .catch(err => Promise.reject(err));
}

async function resetPassword(email, password, confirmPassword, securityToken) {
    const { isAuthServiceResetPassEnabled } = Sephora.configurationSettings;
    const isNGPUserRegistrationEnabled = NGPCookies.isNGPUserRegistrationEnabled();

    let URL = ATG_URL;
    let headers = {};

    if (isAuthServiceResetPassEnabled) {
        URL = AUTH_URL;
        headers = {
            'Content-type': 'application/json',
            'x-requested-source': 'web'
        };
    }

    if (RCPSCookies.isRCPSAuthEnabled()) {
        URL = isNGPUserRegistrationEnabled ? SDN_URL_V2 : SDN_URL;
        headers.deviceId = await authUtils.getFingerPrint();
    }

    return ufeApi
        .makeRequest(URL, {
            method: 'POST',
            body: JSON.stringify({
                type: 'reset',
                email,
                password,
                confirmPassword,
                securityToken: securityToken
            }),
            headers
        })
        .then(data => {
            return data.errorCode || data.errors ? Promise.reject(data) : data;
        })
        .catch(err => Promise.reject(err));
}

export default {
    resetPasswordByLogin,
    resetPassword
};
