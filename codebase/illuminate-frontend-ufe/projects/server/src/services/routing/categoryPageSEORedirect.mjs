import getCategory from '#server/services/api/catalog/categories/getCategory.mjs';
import {
    addQueryParams
} from '#server/services/utils/urlMappingUtils.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

function categoryPageSEORedirect(request, response) {
    const categoryUrl = request.apiOptions.apiPath,
        options = Object.assign({}, request.apiOptions, {
            channel: CHANNELS.RWD
        });

    const categoryId = categoryUrl.replace(/\/shop\//, '');

    getCategory(Object.assign({}, {
        categoryId
    }, options)).then((apiResponse) => {
        const {
            targetUrl
        } = JSON.parse(apiResponse.data);
        const urlToRedirectWithLang = addQueryParams(targetUrl, options.parseQuery);
        sendTempRedirect(response, undefined, urlToRedirectWithLang);

        return;
    }).catch(() => sendTempRedirect(response));
}

export {
    categoryPageSEORedirect
};
