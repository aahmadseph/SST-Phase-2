import ufeApi from 'services/api/ufeApi';
import authUtils from 'utils/Authentication';
import RCPSCookies from 'utils/RCPSCookies';
import userUtils from 'utils/User';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

async function refreshToken(bodyJSON, options) {
    const { newRefreshTokenFlow } = Sephora.configurationSettings;
    let url = '/api/auth/v1/refreshToken';
    let headers = {
        'Content-type': 'application/json',
        'x-requested-source': 'web'
    };

    if (RCPSCookies.isRCPSAuthEnabled()) {
        url = '/gway/v1/dotcom/auth/v1/refreshToken';

        if (options.headers) {
            headers = {
                ...headers,
                ...options.headers
            };
        }

        headers.deviceId = await authUtils.getFingerPrint();
    }

    let payload = bodyJSON;

    if (newRefreshTokenFlow) {
        url = '/gway/v1/dotcom/auth/v2/refreshToken';
        const email = bodyJSON.email || userUtils.getProfileEmail();

        payload = {
            ...(email && { email }),
            accessToken: bodyJSON.accessToken || Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN),
            refreshToken: bodyJSON.accessToken || Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN)
        };
        headers = { ...headers, ...options.headers };
    }

    return ufeApi
        .makeRequest(url, {
            url,
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    refreshToken
};
