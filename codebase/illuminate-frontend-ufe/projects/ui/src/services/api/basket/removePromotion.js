import ufeApi from 'services/api/ufeApi';
import basketUtils from 'utils/Basket';
import Location from 'utils/Location.js';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Remove+Promotion+API
async function removePromotion(orderId, couponCode) {
    const queryParams = [];
    const params = { orderId };

    let url = '/api/shopping-cart/baskets/' + orderId + '/promotions';

    if (Location.isCheckout()) {
        queryParams.push('is_from_checkout=true');
    }

    if (basketUtils.isPickup()) {
        queryParams.push('promoBasket=PICKUP');
    }

    if (couponCode) {
        queryParams.push(`couponCode=${encodeURIComponent(couponCode)}`);
        params.couponCode = encodeURIComponent(couponCode);
    }

    if (queryParams.length) {
        url += '?' + queryParams.join('&');
    }

    try {
        const response = await ufeApi.makeRequest(url, {
            method: 'DELETE',
            body: JSON.stringify(params)
        });

        if (response?.errorCode) {
            throw response;
        }

        return response;
    } catch (error) {
        Sephora.logger.error('Error removing promotion', error);

        return Promise.reject(error);
    }
}

export default removePromotion;
