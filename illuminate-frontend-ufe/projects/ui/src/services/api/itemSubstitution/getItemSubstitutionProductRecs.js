import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import { FULFILLMENT_TYPES } from 'constants/ItemSubstitution';

function getItemSubstitutionProductRecs({
    productId, storeId, fulfillmentType, preferredZipCode, selectedProductId, preferedSku
}) {
    const location = `${languageLocaleUtils.getCurrentLanguage().toLowerCase()}-${languageLocaleUtils.getCurrentCountry()}`;
    const storeIdOrZipCode = fulfillmentType === FULFILLMENT_TYPES.SAMEDAY ? `zipCode=${preferredZipCode}` : `storeId=${storeId}`;

    let url = `/gapi/recommendation/substitution/${productId}?fulfillmentType=${fulfillmentType}&loc=${location}&${storeIdOrZipCode}`;

    if (selectedProductId) {
        url += `&selectedProductId=${selectedProductId}`;
    }

    if (preferedSku) {
        url += `&preferedSku=${preferedSku}`;
    }

    const options = {
        method: 'GET'
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getItemSubstitutionProductRecs;
