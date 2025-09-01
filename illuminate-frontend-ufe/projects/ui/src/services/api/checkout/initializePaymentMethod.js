/* eslint-disable no-unreachable */
import ufeApi from 'services/api/ufeApi';

function initializePaymentMethod(payload) {
    const url = '/api/checkout/afterpay/createCheckout';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default initializePaymentMethod;
