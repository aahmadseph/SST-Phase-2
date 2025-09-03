import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import RCPSCookies from 'utils/RCPSCookies';
import cookieUtils from 'utils/Cookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import accessTokenApi from 'services/api/accessToken/accessToken';

const accessToken = 'AUTH_ACCESS_TOKEN';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Profile+Full+Information
function getProfileFullInformation(_jwtAccessToken, profileId, options) {
    let url = `/api/users/profiles/${profileId}/full`;

    const isUserLoggedIn = !!Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

    const {
        skipApis, includeApis, includeTargeters, productId, preferedSku, propertiesToInclude, refreshSubscriptions, forceLinkedAccountDetails
    } =
        options;

    const qsParams = {
        skipApis,
        includeApis,
        includeTargeters,
        productId,
        preferedSku,
        propertiesToInclude,
        refreshSubscriptions,
        forceLinkedAccountDetails
    };

    if (RCPSCookies.isRCPSFullProfileGroup() && isUserLoggedIn) {
        const biAccountId =
            Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.beautyInsiderAccount?.biAccountId ||
            Storage.local.getItem(LOCAL_STORAGE.BI_ACCOUNT_ID, true);

        const storeId =
            Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.preferredStore || Storage.local.getItem(LOCAL_STORAGE.SELECTED_STORE)?.storeId;

        const userProfileId = Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID, true);

        const sameDayZipcodeCookie = cookieUtils.read('sameDayZipcodeCookie');
        const preferredZipCode = sameDayZipcodeCookie || Storage.session.getItem(LOCAL_STORAGE.SELECTED_STORE)?.address?.postalCode;

        url = `/gapi/users/profiles/${userProfileId}/current/full`;

        // Only append if we have a value
        biAccountId && (qsParams.biAccountId = biAccountId);
        storeId && (qsParams.storeId = storeId);
        preferredZipCode && (qsParams.preferredZipCode = preferredZipCode);
        qsParams.preferenceStruct = 'world';
    }

    const qs = urlUtils.makeQueryString(qsParams);

    if (qs) {
        url += '?' + qs;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(getProfileFullInformation, accessToken);
