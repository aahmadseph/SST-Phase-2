import ufeApi from 'services/api/ufeApi';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import authUtils from 'utils/Authentication';

const ERROR_CODES = [500, 503];

async function getAnonymousToken(config = {}) {
    const url = '/gway/v1/dotcom/auth/v2/session';
    const deviceFingerprint = await authUtils.getFingerPrint();
    const accessToken = window.localStorage.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
    const refreshToken = window.localStorage.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);

    if (accessToken && refreshToken) {
        return null;
    }

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    deviceId: deviceFingerprint
                }
            },
            config
        )
        .then(tokenData => {
            if (tokenData.errorCode || tokenData.errors || ERROR_CODES.includes(tokenData.responseStatus)) {
                return Promise.reject(tokenData);
            }

            authUtils.updateProfileStatus({
                profileSecurityStatus: [tokenData.profileSecurityStatus],
                accessToken: [tokenData.accessToken, tokenData.atExp],
                refreshToken: [tokenData.refreshToken, tokenData.rtExp]
            });

            return tokenData;
        })
        .catch(err => Promise.reject(err));
}

export default { getAnonymousToken };
