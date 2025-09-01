import ufeApi from 'services/api/ufeApi';

function deleteGiftMessage(orderId = 'current') {
    const url = `/api/checkout/orders/${orderId}/digitalGiftMsg`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(response => (response.errorCode ? Promise.reject(response) : response));
}

export default deleteGiftMessage;
