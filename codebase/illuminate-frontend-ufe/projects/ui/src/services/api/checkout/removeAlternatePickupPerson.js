import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Remove+Alternate+Pickup+Person+Details+API

function removeAlternatePickupPerson(orderId = 'current', requestOrigin = '') {
    const requestOriginParamString = requestOrigin ? '?requestOrigin=' + requestOrigin : '';
    const url = `/api/checkout/orders/${orderId}/altPickupPerson${requestOriginParamString}`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeAlternatePickupPerson;
