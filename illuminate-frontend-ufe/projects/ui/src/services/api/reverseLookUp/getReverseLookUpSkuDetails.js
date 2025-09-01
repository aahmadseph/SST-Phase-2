import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+SKU+Detail+API

function getReverseLookUpSkuDetails(skuId) {
    let url = `/api/v3/catalog/skus/${skuId}`;
    const countryCode = localeUtils.getCurrentCountry();
    const queryParams = [];
    const languageCode = localeUtils.getCurrentLanguageCountryCode().replace('_', '-');
    queryParams.push(`?countryCode=${countryCode}&loc=${languageCode}`);

    url = url + queryParams.join('&');

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getReverseLookUpSkuDetails;
