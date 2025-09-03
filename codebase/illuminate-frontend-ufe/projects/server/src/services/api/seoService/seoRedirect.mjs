import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    SEO_UTILS_HOST,
    SEO_UTILS_PORT
} from '#server/config/apiConfig.mjs';

// get seo redirect data
export default function seoRedirect(options) {
    const apiUrl = `/seo-utils/v1/seo${options.url}`;
    const apiOptions = Object.assign({}, options);

    return httpsRequest(SEO_UTILS_HOST, SEO_UTILS_PORT, apiUrl, 'GET', apiOptions);
}
