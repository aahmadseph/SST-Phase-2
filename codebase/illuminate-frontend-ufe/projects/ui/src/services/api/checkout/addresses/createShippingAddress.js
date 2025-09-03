import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Create+Shipping+Address+API

function createShippingAddress(addressData) {
    const url = '/api/checkout/orders/shippingGroups/shippingAddress';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(addressData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default createShippingAddress;
