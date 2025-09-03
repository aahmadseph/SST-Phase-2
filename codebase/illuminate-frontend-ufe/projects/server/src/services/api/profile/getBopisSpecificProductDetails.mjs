import { httpsRequest } from '#server/services/utils/apiRequest.mjs';
import {
    PRODUCT_EXPERIENCE_HOST, PRODUCT_EXPERIENCE_PORT
} from '#server/config/apiConfig.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/GET+ROPIS+Specific+Product+Details

function getBopisSpecificProductDetails(options) {
    const {
        productUrl: productId, language, country
    } = options;

    const url = `/productgraph/v3/users/profiles/current/ropisproduct/${productId}`;
    const loc = `${language}-${country}`;
    let params = `?countryCode=${country}&loc=${loc}`;

    if (options.storeId) {
        params += `&storeId=${options.storeId}`;
    }

    const endpoint = url + params;

    // PXS needs this header to include currentSku as part of regularChildSkus
    const headers = {
        'x-ufe-request': true
    };

    return httpsRequest(PRODUCT_EXPERIENCE_HOST, PRODUCT_EXPERIENCE_PORT, endpoint, 'GET', options, {}, headers);
}

export default logAPICheck(getBopisSpecificProductDetails);
