import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Available+Shipping+Methods+API

function getAvailableShippingMethods(orderId, shippingGroupId) {
    const url = '/api/checkout/orders/' + orderId + '/shippingGroups/' + shippingGroupId + '/shippingMethods';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getAvailableShippingMethods;
