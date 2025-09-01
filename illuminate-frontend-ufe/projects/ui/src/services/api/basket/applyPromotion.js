import ufeApi from 'services/api/ufeApi';
import basketUtils from 'utils/Basket';
import Location from 'utils/Location.js';
import userUtils from 'utils/User';

// Apply+Promotion+API Confluence page
// https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=151201531

function applyPromotion(couponCode, captchaToken) {
    const queryParams = [];
    const params = { couponCode };
    const defaultSAZipCode = userUtils.getDefaultSAZipCode();
    const defaultSACountryCode = userUtils.getDefaultSACountryCode();

    let url = '/api/shopping-cart/basket/promotions';

    if (Location.isCheckout()) {
        queryParams.push('is_from_checkout=true');
    }

    if (queryParams.length) {
        url += '?' + queryParams.join('&');
    }

    if (captchaToken) {
        params.captchaToken = captchaToken;
    }

    if (basketUtils.isPickup()) {
        params.promoBasket = 'PICKUP';
    }

    const headers = {
        ...(defaultSAZipCode && { defaultSAZipCode }),
        ...(defaultSACountryCode && { defaultSACountryCode })
    };

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default applyPromotion;
