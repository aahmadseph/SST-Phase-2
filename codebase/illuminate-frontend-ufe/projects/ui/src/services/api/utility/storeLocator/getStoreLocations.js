import ufeApi from 'services/api/ufeApi';

/**
 * https://confluence.sephora.com/wiki/display/ILLUMINATE/Store+Locator+API
 * Retrieve physical store locations based on input geo data.
 * @param storeId
 * @param params object {zipCode, radius, latitude, longitude,  city, state, country}
 * @returns {Promise}
 */
function getStoreLocations(storeId, params = {}) {
    let url = '/api/util/stores';

    const queryParams = [];

    if (Sephora.configurationSettings.isLMSStoreAPIEnabled) {
        url = '/api/v3/util/stores';
    }

    if (storeId) {
        url += '/' + storeId;
    }

    if (params.zipCode) {
        queryParams.push('zipCode=' + params.zipCode);
    }

    if (params.latitude && params.longitude) {
        queryParams.push('latitude=' + params.latitude);
        queryParams.push('longitude=' + params.longitude);
    }

    if (params.city) {
        queryParams.push('city=' + params.city);
    }

    if (params.state) {
        queryParams.push('state=' + params.state);
    }

    if (params.country) {
        queryParams.push('country=' + params.country);
    } else if (Sephora.renderQueryParams.country) {
        queryParams.push('country=' + Sephora.renderQueryParams.country);
    }

    if (params.radius) {
        queryParams.push('radius=' + params.radius);
        queryParams.push('autoExpand=' + 0);
    }

    if (params.excludeNonSephoraStores) {
        queryParams.push('excludeNonSephoraStores=' + params.excludeNonSephoraStores);
    }

    if (params.includeVirtualStores) {
        queryParams.push('includeVirtualStores=' + params.includeVirtualStores);
    }

    if (params.showContent) {
        queryParams.push('showContent=' + params.showContent);
    }

    if (params.includeRegionsMap) {
        queryParams.push('includeRegionsMap=' + params.includeRegionsMap);
    }

    if (queryParams.length > 0) {
        url = url + '?' + queryParams.join('&');
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => {
        if (data.errorCode) {
            return Promise.reject(data);
        }

        if (data.stores && Array.isArray(data.stores)) {
            data.stores = data.stores.filter(store => {
                const type = store.storeType ? store.storeType.trim().toUpperCase() : '';
                const hasStartDate = !!store.startDate;

                return type === 'SIKLS' || (hasStartDate && type !== 'SIJCP');
            });
        }

        return data;
    });
}

export default getStoreLocations;
