import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+PayPal+Token

function getPayPalToken() {
    const url = '/api/checkout/paypalToken';

    return ufeApi.makeRequest(url).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getPayPalToken;
