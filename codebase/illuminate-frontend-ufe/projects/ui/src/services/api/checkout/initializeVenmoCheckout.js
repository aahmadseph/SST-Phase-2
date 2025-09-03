/* eslint-disable no-unreachable */
import ufeApi from 'services/api/ufeApi';

function initializeVenmoCheckout(payload) {
    const url = '/api/checkout/orders/paymentGroups/venmo';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default initializeVenmoCheckout;
