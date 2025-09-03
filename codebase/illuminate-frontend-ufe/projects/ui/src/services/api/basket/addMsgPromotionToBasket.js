import ufeApi from 'services/api/ufeApi';

// Add MSG Promotion to Basket API Confluence page
// https://confluence.sephora.com/wiki/display/ILLUMINATE/Add+MSG+Promotion+to+Basket+API

function addMsgPromotionToBasket(couponCode, sampleSkuIdList) {
    const url = '/api/shopping-cart/basket/msgs';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                couponCode,
                sampleSkuIdList
            })
        })
        .then(data => {
            return data.errorCode ? Promise.reject(data) : Promise.resolve(data);
        });
}

export default addMsgPromotionToBasket;
