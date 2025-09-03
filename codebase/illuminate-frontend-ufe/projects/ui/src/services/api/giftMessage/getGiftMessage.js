import ufeApi from 'services/api/ufeApi';

function getGiftMessage(orderId = 'current') {
    const url = `/api/checkout/orders/${orderId}/digitalGiftMsg`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET'
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getGiftMessage;
