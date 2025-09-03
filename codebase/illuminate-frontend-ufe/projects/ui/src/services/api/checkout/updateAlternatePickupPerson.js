import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Update+Alternate+Pickup+Person+Details+API

function updateAlternatePickupPerson(params = {}, requestOrigin = '') {
    const requestOriginParamString = requestOrigin ? '?requestOrigin=' + requestOrigin : '';
    const url = '/api/checkout/orders/altPickupPerson' + requestOriginParamString;

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateAlternatePickupPerson;
