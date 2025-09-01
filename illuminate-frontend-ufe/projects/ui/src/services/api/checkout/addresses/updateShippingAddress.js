import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Shipping+Address+API

function updateShippingAddress(addressData) {
    const url = '/api/checkout/orders/shippingGroups/shippingAddress';

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(addressData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateShippingAddress;
