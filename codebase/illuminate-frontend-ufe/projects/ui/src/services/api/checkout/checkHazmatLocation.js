import ufeApi from 'services/api/ufeApi';

function checkHazmatLocation({ zipCode, state }) {
    const url = `/api/checkout/orders/shippingGroups/checkHazmatLocation?zipCode=${zipCode}&state=${state}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default checkHazmatLocation;
