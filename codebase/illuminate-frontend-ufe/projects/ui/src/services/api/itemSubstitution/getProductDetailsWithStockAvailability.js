import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import javascriptUtils from 'utils/javascript';
import { FULFILLMENT_TYPES } from 'constants/ItemSubstitution';

const { buildQuery } = urlUtils;
const { buildMap } = javascriptUtils;

const getProductDetailsWithStockAvailability = (productId, preferredSku, payload = {}) => {
    const { includeAllDetails = false, fulfillmentType, storeId, zipCode } = payload;

    const loc = `${languageLocaleUtils.getCurrentLanguage().toLowerCase()}-${languageLocaleUtils.getCurrentCountry()}`;
    const url = `/gapi/recommendation/details/${productId}`;

    const params = {
        loc,
        preferredSku,
        includeAllDetails,
        fulfillmentType
    };

    if (fulfillmentType === FULFILLMENT_TYPES.PICK) {
        params.storeId = storeId;
    } else if (fulfillmentType === FULFILLMENT_TYPES.SAMEDAY) {
        params.zipCode = zipCode;
    }

    const queryParams = buildQuery(buildMap(params));

    const options = {
        method: 'GET'
    };

    return ufeApi.makeRequest(url + queryParams, options).then(data => (data.errorCode ? Promise.reject(data) : data));
};

export default getProductDetailsWithStockAvailability;
