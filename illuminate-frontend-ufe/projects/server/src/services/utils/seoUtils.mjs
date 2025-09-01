import {
    resolve,
    basename
} from 'path';

import {
    ERROR_404
} from '#server/services/utils/Constants.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const IS_VALID_URL = /[^/]+/,
    REPLACE_API_URL = /\/v1\/util\/seo\//,
    PLAY_BOX_RE = /^play-\w{3,8}-\d{4}$/,
    DOUBLE_SLASH = /\/\//g;

const UNIFIED_CONTENT_STORE = 'Unified Content Store',
    CONTENT_STORE = 'contentstore',
    RWD_CONTENT_STORE = 'Rwd Content Store';

function hasMatch(seoNameIn, targetUrl, targetUrlBase) {

    let resultUrl;

    const isUrlMatch = targetUrl.match(IS_VALID_URL);
    logger.debug(isUrlMatch);

    if (isUrlMatch) {
        if (targetUrl.startsWith(`/${targetUrlBase}`)) {
            resultUrl = targetUrl;
        } else {
            resultUrl = `/${targetUrlBase}/${targetUrl}`;
        }
    } else {
        resultUrl = `/${targetUrlBase}/${seoNameIn}`;
    }

    return resultUrl.replace(DOUBLE_SLASH, '/');
}

function getPlayMediaId(seoNameIn, seoData) {

    const isUrlMatch = seoNameIn.match(PLAY_BOX_RE);
    let mediaId;

    if (isUrlMatch) {
        mediaId = seoData.targetValue.split(';')[0];
    }

    return mediaId;
}

// hidden page the data would look something like
// {"pageType":2,"targetScreen":"contentstore",
// "targetUrl":"/v1/util/seo/japan?countryCode=US",
// "targetValue":"ufe20800044;countryCode=US",
// "type":"Unified Content Store"}
// this handles URLs without the /beauty/ in the URL
function getSeoURL(seoNameIn, seoData) {

    const results = {
        inputUrl: seoNameIn,
        error: seoData.error
    };

    if (seoData.targetScreen && seoData.targetUrl) {
        // remove api endpoint from targetUrl
        results.targetUrl = seoData.targetUrl.replace(REPLACE_API_URL, '').split('?')[0];
        results.targetUrlBase = seoData.targetScreen.toLowerCase();
        results.targetValue = seoData.targetValue || 'error';

        if (results.targetUrlBase === 'category') {
            // {"targetScreen":"category",
            // "targetUrl":"/v1/util/seo/lipstick?countryCode=US",
            // "targetValue":"cat60049;countryCode=US","template":1}
            results.statusCode = 301;
            // FIXME? docs say targetValue but targetUrl seems right
            results.redirectUrl = hasMatch(seoNameIn, results.targetUrl, 'shop');
        } else if (results.targetUrlBase === 'product') {
            // response would look like this
            // {"targetScreen":"product",
            // "targetUrl":"/v1/util/seo/better-than-sex-mascara-P381000?countryCode=US",
            // "targetValue":"P381000;skuId=1789635;countryCode=US"}
            results.statusCode = 301;
            // FIXME? docs say targetValue but targetUrl seems right
            results.redirectUrl = hasMatch(seoNameIn, results.targetUrl, 'product');
        } else if (results.targetUrlBase === 'brandlist') {
            results.statusCode = 302;
            results.redirectUrl = '/brands-list';
        } else if (seoData.type === 'ufeBrand') {
            // {"targetScreen":"brand",
            // "targetUrl":"/v1/util/seo/jo-malone-london?countryCode=US",
            // "targetValue":"6202;countryCode=US","type":"ufeBrand"}
            logger.debug(stringifyMsg(seoData));
            results.statusCode = 301;

            // FIXME? docs say targetValue but targetUrl seems right
            if (seoData.brandCategorySeoName) {
                // TODO finish this impl for brands by removing these
                // Query string is reflected on the redirect location,
                // but "node" and "products" parameters are removed when present.
                results.redirectUrl = hasMatch(seoData.brandCategorySeoName, results.targetUrl, 'brand');
            } else {
                results.redirectUrl = hasMatch(seoNameIn, results.targetUrl, 'brand');
            }
        } else if (seoData.type === UNIFIED_CONTENT_STORE || seoData.type === CONTENT_STORE) {
            // {"pageType":3,"targetScreen":"contentstore",
            // "targetUrl":"/v1/util/seo/brands-list?countryCode=US",
            // "targetValue":"ufebrand46200068;countryCode=US","type":"Unified Content Store"}
            // there is a pageType === 1
            if (seoData.pageType === 2) {
                results.redirectUrl = '/';
                results.statusCode = 302;
            } else if (seoData.pageType === 3) {
                // common content store handling
                results.mediaId = getPlayMediaId(seoNameIn, seoData);
            } else {
                logger.debug(stringifyMsg(seoData));
                results.statusCode = 301;
                results.redirectUrl = hasMatch(seoNameIn, results.targetUrl, 'beauty');
            }
        } else if (seoData.type === RWD_CONTENT_STORE && seoData.targetValue) {
            const redirectUrl = hasMatch(seoNameIn, results.targetUrl, 'beauty');

            if (seoNameIn !== results.redirectUrl) {
                results.statusCode = 301;
                results.redirectUrl = redirectUrl;
            }

            results.mediaId = seoData.targetValue.split(';')[0];
        } else {
            // seo lookup can't find this url
            // Houston we have a problem!
            logger.debug(stringifyMsg(seoData));
            results.statusCode = 302;
            results.redirectUrl = ERROR_404;
        }
    } else if (seoData.error) {
        results.mediaId = getPlayMediaId(seoNameIn, seoData);
        results.statusCode = 302;
        results.redirectUrl = ERROR_404;
    }

    return results;
}

export {
    getSeoURL,
    getPlayMediaId,
    UNIFIED_CONTENT_STORE,
    RWD_CONTENT_STORE
};
