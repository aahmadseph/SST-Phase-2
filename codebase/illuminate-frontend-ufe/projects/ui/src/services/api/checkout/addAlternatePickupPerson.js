import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Add+Alternate+Pickup+Person+Details+API

function addAlternatePickupPerson(params = {}, requestOrigin = '') {
    const requestOriginParamString = requestOrigin ? '?requestOrigin=' + requestOrigin : '';
    const url = '/api/checkout/orders/altPickupPerson' + requestOriginParamString;

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addAlternatePickupPerson;
