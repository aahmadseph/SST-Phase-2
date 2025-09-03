import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Shipping+Address+to+Profile+API

function addShippingAddress(input) {
    let url = '/api/users/profiles/address';

    if (RCPSCookies.isRCPShippingAPIEnabled()) {
        url = '/gway/v2/users/profiles/address';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(input)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addShippingAddress;
