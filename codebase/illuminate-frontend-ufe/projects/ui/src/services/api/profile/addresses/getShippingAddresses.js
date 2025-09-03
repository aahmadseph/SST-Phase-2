import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Shipping+Addresses+from+Profile+API
function getShippingAddresses(profileId) {
    let url = `/api/users/profiles/${profileId}/addresses`;

    if (RCPSCookies.isRCPShippingAPIEnabled()) {
        url = `/gway/v2/users/profiles/${profileId}/addresses`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getShippingAddresses;
