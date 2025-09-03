import ufeApi from 'services/api/ufeApi';
import catalogUtils from 'utils/Catalog';
import localeUtils from 'utils/LanguageLocale';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Find+In+Store+API

/**
 * Find specific SKU in stores by some geo data.
 * @param skuId string  sku id of product
 * @param params object {zipCode, radius, latitude, longitude}
 * @returns {Promise}
 */
function findInStore(skuId, params = {}) {
    let url = `/api/catalog/skus/${skuId}/search?`;

    const queryParams = [];

    if (catalogUtils.isPXSSearchEnabled()) {
        url = `/api/v3/catalog/skus/${skuId}/search?`;
        const locale = localeUtils.getCurrentLanguageLocale();
        queryParams.push('loc=' + locale);
    }

    if (params.zipCode) {
        queryParams.push('zipCode=' + params.zipCode);
    }

    if (params.country) {
        queryParams.push('country=' + params.country);
    }

    if (params.radius) {
        queryParams.push('radius=' + params.radius);
    }

    if (params.latitude && params.longitude) {
        queryParams.push('latitude=' + params.latitude);
        queryParams.push('longitude=' + params.longitude);
    }

    if (params.excludeNonSephoraStores) {
        queryParams.push('excludeNonSephoraStores=' + params.excludeNonSephoraStores);
    }

    url = url + queryParams.join('&');

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default findInStore;
