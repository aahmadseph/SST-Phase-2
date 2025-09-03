import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Order+Shipping+Address+API

function removeOrderShippingAddress(orderId, shippingGroupId, shippingAddressId) {
    let url = `/api/checkout/orders/${orderId}/shippingGroups/${shippingGroupId}/shippingAddress`;

    //check that addressId is valid profile addressId
    //address only in order will begin with 'sg'
    if (shippingAddressId && shippingAddressId.indexOf('sg') !== 0) {
        url = url + `/${shippingAddressId}`;
    }

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeOrderShippingAddress;
