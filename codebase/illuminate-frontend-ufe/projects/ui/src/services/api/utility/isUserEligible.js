import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Is+User+Eligible+API
function isUserEligible(skuList) {
    const url = '/api/util/sku/isUserEligible';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(skuList)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default isUserEligible;
