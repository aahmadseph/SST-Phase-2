import ufeApi from 'services/api/ufeApi';
import accessTokenApi from 'services/api/accessToken/accessToken';

const accessToken = 'AUTH_ACCESS_TOKEN';

function submitCreditCardApplication(_, customerInformation) {
    const url = '/gway/v2/scc/submit';
    const systemCode = Sephora.isMobile() ? 'MOBILE_WEB' : 'WEB';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(customerInformation),
            headers: {
                'Content-Type': 'application/json',
                'X-System-Code': systemCode,
                'X-Tenant-Id': 'SEPHORA'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(submitCreditCardApplication, accessToken);
