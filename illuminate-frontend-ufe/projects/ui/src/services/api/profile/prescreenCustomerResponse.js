import ufeApi from 'services/api/ufeApi';
import accessTokenApi from 'services/api/accessToken/accessToken';

const accessToken = 'AUTH_ACCESS_TOKEN';

function prescreenCustomerResponse(_, loyaltyId, customerResponse) {
    const url = `/gway/v2/scc/prescreen/customer-response/${loyaltyId}/${customerResponse}`;

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            headers: {
                'X-Tenant-Id': 'SEPHORA',
                'X-System-Code': 'WEB'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(prescreenCustomerResponse, accessToken);
