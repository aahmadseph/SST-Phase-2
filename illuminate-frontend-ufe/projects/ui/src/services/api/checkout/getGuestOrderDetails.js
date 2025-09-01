import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Order+Details+API
function getGuestOrderDetails(orderId, email, requestOrigin = null) {
    const url =
        '/api/checkout/orders/' +
        orderId +
        '?includeShippingItems=true&includeProfileFlags=true&guestEmail=' +
        email +
        (requestOrigin ? `&requestOrigin=${requestOrigin}` : '');

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getGuestOrderDetails;
