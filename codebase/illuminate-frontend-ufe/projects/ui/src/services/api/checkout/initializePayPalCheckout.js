import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Initialize+PayPal+checkout+API

function initializePayPalCheckout(payload) {
    const url = '/api/checkout/paypal/init';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default initializePayPalCheckout;
