import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Order+Cancel+API

function cancelOrder(params = {}) {
    const url = '/api/checkout/orders/cancel';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default cancelOrder;
