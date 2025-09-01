import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

const forBV = 'forBV';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+User-Specific+Product+Details+API

function getUserSpecificProductDetails(productId, skuId = null, checkVerified = false, profileId = 'current') {
    let url = `/api/v3/users/profiles/${profileId}/product/${productId}?`;

    const queryParams = [];
    queryParams.push('skipAddToRecentlyViewed=false');

    if (skuId !== null) {
        if (skuId !== forBV) {
            queryParams.push(`preferedSku=${skuId}`);
        }

        if (checkVerified) {
            queryParams.push('verifiedPurchase=true');
        }
    }

    const countryCode = localeUtils.getCurrentCountry();
    const languageCode = localeUtils.getCurrentLanguageCountryCode().replace('_', '-');
    queryParams.push(`countryCode=${countryCode}&loc=${languageCode}`);

    url = url + queryParams.join('&');

    return ufeApi
        .makeRequest(url, { method: 'GET' })
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(reason => {
            // eslint-disable-next-line no-console
            console.error('getUserSpecificProductDetails failed for ' + `productId, skuId: ${productId}, ${skuId}.`);

            return Promise.reject(reason);
        });
}

export default getUserSpecificProductDetails;
