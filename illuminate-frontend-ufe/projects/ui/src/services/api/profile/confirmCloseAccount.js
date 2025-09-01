import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import store from 'store/Store';
import UUIDv4 from 'utils/UUID';
import Hashing from 'utils/Hashing';
import authUtils from 'utils/Authentication';
import { URLS, AUTH_HEADERS } from 'constants/authentication';
import GenerateTokens from 'services/api/authentication/generateLithiumSsoToken';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const { generateTokens } = GenerateTokens;

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Confirm+Close+Account+API

export function confirmCloseAccount(password) {
    let url = '/api/secure/confirmCloseAccount';

    if (RCPSCookies.isRCPSProfileInfoGroupAPIEnabled()) {
        const { login } = store.getState().user;
        const randomNumber = UUIDv4();
        url = '/gway/v2/secure/confirmCloseAccount';

        return Hashing.sha256(randomNumber).then(async function (digest) {
            let loginUrl = URLS.ATG_LOGIN_URL;
            const headers = AUTH_HEADERS;

            if (RCPSCookies.isRCPSAuthEnabled()) {
                loginUrl = URLS.SDN_LOGIN_URL;
                headers.deviceId = await authUtils.getFingerPrint();
            }

            const body = {
                password,
                email: login,
                randomNumber: digest
            };

            return ufeApi
                .makeRequest(loginUrl, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers
                })
                .then(async response => {
                    if (response?.errors) {
                        const errorResponse = {
                            errorMessages: [response.errors[0]?.errorMessage]
                        };

                        return Promise.reject(errorResponse);
                    }

                    const cachedProfileStatus = Storage.local.getItem(LOCAL_STORAGE.PROFILE_SECURITY_STATUS);

                    if (cachedProfileStatus <= 3) {
                        body.token = response.token;
                        body.randomNumber = randomNumber;
                        const generateTokensResponse = await generateTokens(body);

                        authUtils.updateProfileStatus({
                            profileSecurityStatus: [generateTokensResponse?.tokens?.profileSecurityStatus],
                            accessToken: [generateTokensResponse?.tokens?.accessToken, generateTokensResponse?.tokens?.atExp],
                            refreshToken: [generateTokensResponse?.tokens?.refreshToken, generateTokensResponse?.tokens?.rtExp]
                        });
                    }

                    return ufeApi
                        .makeRequest(url, {
                            method: 'POST',
                            body: JSON.stringify({ password, email: login }),
                            headers: {
                                'x-requested-source': 'web'
                            }
                        })
                        .then(data => (data.errorCode ? Promise.reject(data) : data));
                });
        });
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({ password })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { confirmCloseAccount };
