import ufeApi from 'services/api/ufeApi';
import authUtils from 'utils/Authentication';
import RCPSCookies from 'utils/RCPSCookies';
import userUtils from 'utils/User';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Auto+Login+API

async function autoLogin(_body = {}) {
    const { newRefreshTokenFlow } = Sephora.configurationSettings;
    let url = '/api/ssi/autoLogin';
    const headers = {
        'Content-type': 'application/json',
        'x-requested-source': 'web'
    };

    if (RCPSCookies.isRCPSAuthEnabled()) {
        headers.deviceId = await authUtils.getFingerPrint();
    }

    let payload = _body;

    if (newRefreshTokenFlow) {
        url = '/gway/v1/dotcom/auth/v2/refreshToken';

        payload = {
            email: userUtils.getProfileEmail(),
            accessToken: Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN),
            refreshToken: Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN)
        };
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { autoLogin };
