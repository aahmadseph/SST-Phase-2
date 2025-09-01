import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';
import servicesUtils from 'utils/Services';

const { userXTimestampHeader } = headerUtils;
const { appendIOSSafariCacheBustingParam } = servicesUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+to+Cart+API

function addToCart({ orderId, skuList, fulfillmentType = null }, includeAllBasketItems) {
    const url = appendIOSSafariCacheBustingParam(`/api/shopping-cart/basket/items${includeAllBasketItems ? '?includeAllBasketItems=true' : ''}`);

    const body = {
        orderId,
        skuList
    };

    if (fulfillmentType) {
        body.fulfillmentType = fulfillmentType;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: userXTimestampHeader(),
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addToCart;
