import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+BI+Rewards+to+Cart+API

function addBiRewardsToCart(skuId, productId, fulfillmentType) {
    const url = '/api/bi/profile/rewards?includeBasket=true';
    let body = { biRewards: [skuId] };

    if (productId) {
        body = { ...body, biRewardsList: [{ skuId, productId }] };
    }

    if (fulfillmentType) {
        body.fulfillmentType = fulfillmentType;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addBiRewardsToCart;
