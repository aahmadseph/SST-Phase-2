import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Set+Pickup+Method+API

function setPickupMethod(pickupMethodData) {
    const url = '/api/checkout/orders/pickupMethod';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(pickupMethodData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default setPickupMethod;
