import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+SKU+Detail+API

// (!) As of 8/29/2017 this seems to be unused.

function getSkuDetails(skuId) {
    let url = `/api/v3/catalog/skus/${skuId}`;
    const queryParams = [];
    const countryCode = localeUtils.getCurrentCountry();
    const languageCode = localeUtils.getCurrentLanguageCountryCode().replace('_', '-');
    queryParams.push(`?countryCode=${countryCode}&loc=${languageCode}`);

    url = url + queryParams.join('&');

    return ufeApi.makeRequest(url).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getSkuDetails;
