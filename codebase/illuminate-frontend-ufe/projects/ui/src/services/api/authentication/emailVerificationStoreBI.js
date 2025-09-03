import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import authUtils from 'utils/Authentication';
import NGPCookies from 'utils/NGPCookies';

const URL = '/api/auth/v1/emailVerificationStoreBI';
const SDN_URL = '/gway/v1/dotcom/auth/v1/emailVerificationStoreBI';
const SDN_URL_V2 = '/gway/v1/dotcom/auth/v2/emailVerificationStoreBI';

async function emailVerificationStoreBI(email, token) {
    const isNGPUserRegistrationEnabled = NGPCookies.isNGPUserRegistrationEnabled();
    let url = URL;
    const headers = {
        'Content-type': 'application/json',
        'x-requested-source': 'web'
    };
    const payload = {};

    if (email) {
        payload.email = email;
    } else if (token) {
        payload.token = token;
    }

    if (RCPSCookies.isRCPSAuthEnabled()) {
        url = SDN_URL;
        headers.deviceId = await authUtils.getFingerPrint();
    }

    if (isNGPUserRegistrationEnabled) {
        url = SDN_URL_V2;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        })
        .then(data => {
            return data.errorCode || data.errors ? Promise.reject(data) : data;
        })
        .catch(err => Promise.reject(err));
}

export default { emailVerificationStoreBI };
