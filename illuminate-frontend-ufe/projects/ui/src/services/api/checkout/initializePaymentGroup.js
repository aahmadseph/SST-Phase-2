/* eslint-disable no-unreachable */
import ufeApi from 'services/api/ufeApi';

function initializePaymentGroup(payload) {
    const url = '/api/checkout/orders/paymentGroup';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default initializePaymentGroup;
