import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Order+Header+API
function getOrderHeader(orderId) {
    const url = '/api/checkout/orders/' + orderId + '/header?includeSMSFlags=true';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getOrderHeader;
