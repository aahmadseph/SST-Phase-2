import ufeApi from 'services/api/ufeApi';
import Location from 'utils/Location';
import UrlUtils from 'utils/Url';
import OrderUtils from 'utils/Order';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Order+Details+API
function getOrderDetails(orderId, guestEmail = '', isReshipOrder = false, appendRequestOrigin = false, originalOrderId = '') {
    const guestEmailParamString = guestEmail ? '&guestEmail=' + guestEmail : '';
    const originalOrderIdParam = originalOrderId ? `&originalOrderId=${originalOrderId}` : '';
    let requestOriginParamString = '';
    const isOrderDetailsPage = Location.isOrderDetailsPage();
    const requestOrigin = UrlUtils.getParams().requestOrigin;

    if (isOrderDetailsPage || appendRequestOrigin) {
        const originType = requestOrigin?.includes?.(OrderUtils.ORDER_DETAILS_REQUESTS_ORIGIN.ORD_CONFIRMATION_PAGE)
            ? OrderUtils.ORDER_DETAILS_REQUESTS_ORIGIN.ORD_CONFIRMATION_PAGE
            : OrderUtils.ORDER_DETAILS_REQUESTS_ORIGIN.ORD_DETAILS_PAGE;

        requestOriginParamString = `&requestOrigin=${originType}`;
    }

    let url =
        '/api/checkout/orders/' +
        orderId +
        '?includeShippingItems=true&includeProfileFlags=true' +
        originalOrderIdParam +
        guestEmailParamString +
        requestOriginParamString;

    if (isReshipOrder) {
        url += `&isReshipOrder=${isReshipOrder}`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getOrderDetails;
