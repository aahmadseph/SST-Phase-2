import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Initialize+checkout+API

function initializeCheckout(payload) {
    const url = '/api/checkout/order/init';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data && data.errorCode ? Promise.reject(data) : data));
}

export default initializeCheckout;
