import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Shipping+Method+API

function setShippingMethod(shippingMethodData) {
    const url = '/api/checkout/orders/shippingGroups/shippingMethod';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(shippingMethodData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default setShippingMethod;
