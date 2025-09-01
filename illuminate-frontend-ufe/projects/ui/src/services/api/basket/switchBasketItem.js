import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Switch+Item+From+Cart+API

function switchBasketItem(skuId = '', qty = 1, currentBasket, action, deliveryOption, productId) {
    const url = '/api/shopping-cart/basket/switchItem';
    const body = {
        skuId: skuId,
        qty: qty,
        currentBasket: currentBasket,
        action: action
    };

    if (productId) {
        body.productId = productId;
    }

    if (deliveryOption) {
        body.deliveryOption = deliveryOption;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default switchBasketItem;
