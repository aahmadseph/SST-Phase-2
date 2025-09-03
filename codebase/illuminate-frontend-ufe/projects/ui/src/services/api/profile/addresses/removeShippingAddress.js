import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Shipping+Address+from+Profile+API

function removeShippingAddress(profileId, addressId) {
    let url = `/api/users/profiles/${profileId}/address/${addressId}`;

    if (RCPSCookies.isRCPShippingAPIEnabled()) {
        url = `/gway/v2/users/profiles/${profileId}/address/${addressId}`;
    }

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeShippingAddress;
