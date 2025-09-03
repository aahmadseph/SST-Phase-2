import ufeApi from 'services/api/ufeApi';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import cookieUtils from 'utils/Cookies';
import UUIDv4 from 'utils/UUID';
import Hashing from 'utils/Hashing';
import RCPSCookies from 'utils/RCPSCookies';
import authUtils from 'utils/Authentication';
import { URLS, AUTH_HEADERS } from 'constants/authentication';

const { sha256 } = Hashing;

/**
 *
 * @param {*} body
 * @param {*} options
 * @returns
 */
export const generateTokens = async (body, options = {}) => {
    const { enableV2GenerateToken = false } = Sephora.configurationSettings;
    let url = '/api/auth/v1/generateToken';

    const headers = {
        'Content-type': 'application/json',
        'x-requested-source': 'web',
        'X-CAUSED-BY-URL': options.headerValue
    };

    if (RCPSCookies.isRCPSAuthEnabled()) {
        url = '/gway/v1/dotcom/auth/v1/generateToken';
        headers.deviceId = await authUtils.getFingerPrint();
    }

    if (enableV2GenerateToken) {
        url = '/gway/v1/dotcom/auth/v2/generateToken';
    }

    try {
        const response = await ufeApi.makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        });

        if (response?.errors) {
            throw response.errors[0];
        }

        // Store relevant data from response
        _storeGenerateTokenValues(response);

        // Return resp so the login execution can continue per usual
        return response;
    } catch (error) {
        if (error?.errors) {
            throw error.errors[0];
        }

        // Preserve original error message
        throw error;
    }
};

/**
 *
 * @param {*} generateTokenResp
 */
const _storeGenerateTokenValues = generateTokenResp => {
    const LITHIUM_SSO_TOKEN_COOKIE_NAME = 'lithiumSSO:sephora.qa';
    const lithiumSSOToken = generateTokenResp?.lithiumSsoToken;

    // Success, let's store the lithium sso token in LocalStorage for later.
    Storage.local.setItem(LOCAL_STORAGE.LITHIUM_API_TOKEN, lithiumSSOToken);

    // Store access token since new sdn lith token depends on it.
    Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, generateTokenResp?.tokens?.accessToken);
    Storage.local.setItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN, generateTokenResp?.tokens?.refreshToken);

    // Store profileId and biAccountId for sdn full call
    Storage.local.setItem(LOCAL_STORAGE.PROFILE_ID, generateTokenResp?.profileId);
    Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, generateTokenResp?.beautyInsiderAccount?.biAccountId || generateTokenResp?.biAccountId);

    // Update cookie to hold lithium sso token
    cookieUtils.write(LITHIUM_SSO_TOKEN_COOKIE_NAME, lithiumSSOToken, null, true, false);
};

/**
 *
 * @param {*} email
 * @param {*} password
 * @returns
 *
 * Allows us to invoke generateTokens from files other than
 * just login.js
 */
export const manuallyGenerateTokens = async (email, password) => {
    const randomNum = UUIDv4();
    const loginAccessToken = await simpleLoginCall(email, randomNum, password);

    const body = {
        email,
        password,
        randomNumber: randomNum,
        token: loginAccessToken
    };

    return await generateTokens(body);
};

/**
 *
 * @param {*} email
 * @param {*} randomNum
 * @returns
 *
 * Slimmed down version of our full login call in login.js
 * Runs only essential portion of login to provide /generateToken call
 * with needed access token
 */
const simpleLoginCall = async (email, randomNum, password) => {
    const hashedNum = await sha256(randomNum);
    let url = URLS.ATG_LOGIN_URL;
    const headers = AUTH_HEADERS;

    if (RCPSCookies.isRCPSAuthEnabled()) {
        url = URLS.SDN_LOGIN_URL;
        headers.deviceId = await authUtils.getFingerPrint();
    }

    const body = {
        email,
        password,
        randomNumber: hashedNum
    };

    try {
        const response = await ufeApi.makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        });

        if (response?.errors) {
            throw response.errors[0];
        }

        // Returns needed access token required by /generateToken
        return response.token;
    } catch (error) {
        throw new Error(error);
    }
};

export default { generateTokens };
