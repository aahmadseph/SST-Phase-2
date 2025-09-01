import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Shipping+Address+on+Profile+API

function updateShippingAddress(addressData) {
    let url = '/api/users/profiles/address';

    if (RCPSCookies.isRCPShippingAPIEnabled()) {
        url = '/gway/v2/users/profiles/address';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(addressData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateShippingAddress;
