import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Default+Shipping+Address+on+Profile+API

function setDefaultShippingAddress(addressId) {
    let url = '/api/users/profiles/addresses/defaultAddress';

    if (RCPSCookies.isRCPShippingAPIEnabled()) {
        url = '/gway/v2/users/profiles/addresses/defaultAddress';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify({ addressId })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default setDefaultShippingAddress;
