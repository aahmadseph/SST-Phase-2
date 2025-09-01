import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Initiate+Anonymous+Checkout+API

function initializeAnonymousCheckout(payload) {
    const url = '/api/checkout/initAnonymousPurchase';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default initializeAnonymousCheckout;
