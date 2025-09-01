import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';
import RCPSCookies from 'utils/RCPSCookies';
import authUtils from 'utils/Authentication';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { userXTimestampHeader } = headerUtils;

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Create+User+API
const URL = '/gway/v1/dotcom/auth/v1/user/register';

export async function createUser(profileData) {
    const {
        headerValue, inStoreUser, isEpvEmailValidation, biAccountId, ...args
    } = profileData;

    if (isEpvEmailValidation) {
        args.isStoreRegistration = false;
    } else if (inStoreUser) {
        args.isStoreRegistration = inStoreUser;
        args.biId = biAccountId;
    }

    delete args.inStoreUser;
    delete args.isEpvEmailValidation;

    const headers = {
        'x-requested-source': 'web',
        'Content-Type': 'application/json',
        ...(headerValue && { headerValue }),
        ...userXTimestampHeader()
    };

    if (RCPSCookies.isRCPSAuthEnabled()) {
        headers.deviceId = await authUtils.getFingerPrint();
    }

    try {
        const data = await ufeApi.makeRequest(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(args)
        });

        // Store profileId and biAccountId from when a user is first created
        Storage.local.setItem(LOCAL_STORAGE.PROFILE_ID, data?.profileId);
        Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, data?.biAccountId);

        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export default { createUser };
