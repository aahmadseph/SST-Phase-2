import {
    handleErrorResponse,
    PAGE_TYPE
} from '#server/services/utils/handleErrorResponse.mjs';
import {
    addQueryParams
} from '#server/services/utils/urlMappingUtils.mjs';
import getPXSDetails from '#server/services/api/catalog/products/getPXSDetails.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

function productPageSEORedirect(request, response) {
    const getProductsAPI = getPXSDetails;
    const productUrl = request.apiOptions.apiPath,
        options = Object.assign({}, request.apiOptions, {
            channel: CHANNELS.RWD
        });

    const seoProductName = productUrl.replace(/\/product\//, '');
    getProductsAPI(Object.assign({}, {
        productUrl: seoProductName
    }, options)).then((apiResponse) => {
        const {
            content = {}, seoCanonicalUrl = ''
        } = JSON.parse(apiResponse.data);
        const seoURL = seoCanonicalUrl ? seoCanonicalUrl : content.seoCanonicalUrl;
        const newUrl = (seoURL ?
            request.url.replace(productUrl, seoURL) :
            seoURL);
        const urlToRedirectWithLang = addQueryParams(newUrl, options.parseQuery);
        sendTempRedirect(response, undefined, urlToRedirectWithLang);

        return;
    }).catch((err) => handleErrorResponse(response, err, PAGE_TYPE.PRODUCT));
}

export {
    productPageSEORedirect
};
