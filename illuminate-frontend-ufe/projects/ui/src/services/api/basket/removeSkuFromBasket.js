import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+SKU+from+basket+API

function removeSkuFromBasket(orderId, skuId, modifyConfirmed, isRopisSku, productId) {
    let url = '/api/shopping-cart/baskets/' + orderId + '/items/' + skuId;

    const queryParams = [];

    if (modifyConfirmed) {
        queryParams.push('modifyConfirmed=' + modifyConfirmed);
    }

    if (productId) {
        queryParams.push('productId=' + productId);
    }

    if (isRopisSku) {
        queryParams.push('fulfillmentType=ROPIS');
    }

    if (queryParams.length > 0) {
        url = url + '?' + queryParams.join('&');
    }

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeSkuFromBasket;
