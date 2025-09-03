import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/GET+ROPIS+Specific+Product+Details

function getRopisSpecificProductDetails(profileId = 'current', productId, skuId = null, source = 'other') {
    const apiVersion = '/api/v3';

    let url = `${apiVersion}/users/profiles/${profileId}/ropisproduct/${productId}`;
    const queryParams = [];

    if (skuId !== null) {
        const countryCode = localeUtils.getCurrentCountry();
        const languageCode = localeUtils.getCurrentLanguageCountryCode().replace('_', '-');
        queryParams.push(`?preferedSku=${skuId}&countryCode=${countryCode}&loc=${languageCode}`);
    }

    url = url + queryParams.join('&');

    const options = {
        method: 'GET',
        headers: { 'x-sephora-page-source': source }
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getRopisSpecificProductDetails;
