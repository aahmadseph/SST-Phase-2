import ufeApi from 'services/api/ufeApi';
import accessTokenApi from 'services/api/accessToken/accessToken';

const accessToken = 'AUTH_ACCESS_TOKEN';

function getCustomerInformation(_, loyaltyId) {
    const url = `/gway/v2/scc/info/${loyaltyId}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                'X-System-Code': 'WEB',
                'X-Tenant-Id': 'SEPHORA'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(getCustomerInformation, accessToken);
