import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Samples+to+Basket+API

function addSamplesToBasket(sampleSkuIdList, sampleSkuList) {
    const url = '/api/shopping-cart/basket/samples';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({ sampleSkuIdList, sampleSkuList })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addSamplesToBasket;
