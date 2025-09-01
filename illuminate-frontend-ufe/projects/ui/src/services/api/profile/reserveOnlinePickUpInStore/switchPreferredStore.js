import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import userUtils from 'utils/User';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Switch+Preferred+Store+API

function switchPreferredStore(preferredStoreId, customerSelected) {
    const isUserAnonymous = userUtils.isAnonymous();
    const isRCPSProfileBiGroupAPIEnabled = RCPSCookies.isRCPSProfileBiGroupAPIEnabled();
    const { isAnonProfileEnabled } = Sephora.configurationSettings;

    if (isUserAnonymous && isAnonProfileEnabled) {
        return Promise.resolve();
    }

    const url = isRCPSProfileBiGroupAPIEnabled && !isUserAnonymous ? '/gway/v2/users/profiles/preferredStore' : '/api/users/profile/preferredStore';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                preferredStoreId: preferredStoreId,
                customerSelected: customerSelected
            })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default switchPreferredStore;
