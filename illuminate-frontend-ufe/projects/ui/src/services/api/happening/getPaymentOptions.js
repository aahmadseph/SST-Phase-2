import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Payment+Options+API

function getPaymentOptions(profileId) {
    const url = `/api/payments/options/${profileId}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getPaymentOptions;
