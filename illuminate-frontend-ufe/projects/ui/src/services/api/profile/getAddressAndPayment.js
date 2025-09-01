import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import RCPSCookies from 'utils/RCPSCookies';
import accessTokenApi from 'services/api/accessToken/accessToken';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Address+and+Payment+API
const accessToken = 'AUTH_ACCESS_TOKEN';

function getAddressAndPayment(_jwtAccessToken, args) {
    const { profileId, shippingAddressId, paymentId, addressRequired = true } = args;
    const queryParams = new Map();

    if (addressRequired) {
        queryParams.set('shippingAddressId', shippingAddressId);
    }

    if (RCPSCookies.isRCPSProfileInfoGroupAPIEnabled()) {
        queryParams.set('profileId', profileId);
    }

    queryParams.set('creditCardId', paymentId);
    const queryString = urlUtils.buildQuery(queryParams);

    let url = `/api/users/profiles/${profileId}/addressAndPayment${queryString}`;

    if (RCPSCookies.isRCPSProfileInfoGroupAPIEnabled()) {
        url = `/gapi/users/profiles/${profileId}/addressAndPayment${queryString}`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(getAddressAndPayment, accessToken);
