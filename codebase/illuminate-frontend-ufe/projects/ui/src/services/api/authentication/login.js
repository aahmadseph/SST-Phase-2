import ufeApi from 'services/api/ufeApi';
import UUIDv4 from 'utils/UUID';
import Hashing from 'utils/Hashing.js';
import authenticationUtils from 'utils/Authentication';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import GenerateTokens from 'services/api/authentication/generateLithiumSsoToken';
import RCPSCookies from 'utils/RCPSCookies';
import { URLS, AUTH_HEADERS } from 'constants/authentication';

const { sha256 } = Hashing;
const { isAuthServiceEnabled, getFingerPrint } = authenticationUtils;
const { generateTokens } = GenerateTokens;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Login+API

function login({ deviceFingerprint, login: log1n, password, options }) {
    const {
        loginForCheckout, isKeepSignedIn, isOrderConfirmation, biAccountInfo, extraParams: allExtraParams
    } = options;
    const { isCheckoutInitAttempt, headerValue, ...extraParams } = allExtraParams || {};

    let body = {
        login: log1n,
        password,
        ...(isKeepSignedIn && deviceFingerprint && { deviceFingerprint })
    };

    if (isOrderConfirmation) {
        body.source = 'orderConfirmation';

        if (biAccountInfo) {
            body.isJoinBi = biAccountInfo.isJoinBi;
            body.biAccount = biAccountInfo.birthday;
            body.subscription = biAccountInfo.subscription;
        }
    } else {
        body.loginForCheckout = loginForCheckout;
        body.isKeepSignedIn = isKeepSignedIn;
    }

    if (Object.keys(extraParams).length) {
        body = {
            ...body,
            ...extraParams
        };
    }

    if (isAuthServiceEnabled()) {
        body.email = body.login;
        delete body.login;

        body.keepSignedIn = body.isKeepSignedIn;
        delete body.isKeepSignedIn;

        const randomNumber = UUIDv4();

        return sha256(randomNumber).then(async function (digest) {
            const token = digest;
            body.randomNumber = token;
            let url = URLS.ATG_LOGIN_URL;
            const headers = AUTH_HEADERS;
            const xCausedHeader = headerValue || location.href;
            headers['X-CAUSED-BY-URL'] = xCausedHeader;

            if (RCPSCookies.isRCPSAuthEnabled()) {
                url = URLS.SDN_LOGIN_URL;
                headers.deviceId = await getFingerPrint();
            }

            return ufeApi
                .makeRequest(url, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers
                })
                .then(async tokenData => {
                    if (tokenData?.errors) {
                        return Promise.reject(tokenData.errors[0]);
                    }

                    if (tokenData?.responseStatus >= 400) {
                        return Promise.reject(tokenData);
                    }

                    if (tokenData?.isStoreBiMember && Sephora.configurationSettings.isEmailVerificationEnabled) {
                        return Promise.resolve({
                            shouldTriggerEmailVerification: true,
                            isStoreBiMember: true
                        });
                    }

                    if (tokenData?.profileWarnings) {
                        Storage.local.setItem(LOCAL_STORAGE.LOGIN_PROFILE_WARNINGS, tokenData?.profileWarnings);

                        if (isCheckoutInitAttempt) {
                            Storage.local.setItem(LOCAL_STORAGE.POSTPONE_LOGIN_PROFILE_WARNINGS, true);
                        }
                    }

                    body.token = tokenData.token;
                    body.randomNumber = randomNumber;

                    const generateTokensResponse = await generateTokens(body, { headerValue: xCausedHeader });

                    return {
                        ...generateTokensResponse,
                        hasIdentity: tokenData.hasIdentity
                    };
                });
        });
    }

    const url = '/api/auth/login';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                'x-requested-source': 'web'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { login };
