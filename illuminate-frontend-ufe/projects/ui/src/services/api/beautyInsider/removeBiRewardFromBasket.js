import ufeApi from 'services/api/ufeApi';
import basketConstants from 'constants/Basket';
const { API_BASKET_TYPE, BasketType } = basketConstants;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+BI+Reward+from+Basket+API

function removeBiRewardFromBasket(orderId, skuId, productId, basketType) {
    let url = '/api/bi/orders/' + orderId + '/rewards/' + skuId;
    const fulfillmentType = basketType === API_BASKET_TYPE.BOPIS ? BasketType.BOPIS : basketType;
    const queryParams = [];

    queryParams.push('includeBasket=true');

    if (fulfillmentType && fulfillmentType !== API_BASKET_TYPE.standard) {
        queryParams.push(`fulfillmentType=${fulfillmentType}`);
    }

    if (productId) {
        queryParams.push(`productId=${productId}`);
    }

    if (queryParams.length > 0) {
        url = url + '?' + queryParams.join('&');
    }

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeBiRewardFromBasket;
