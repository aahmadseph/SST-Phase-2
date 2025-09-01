import crypto from 'node:crypto';

import {
    ENABLE_SEO
} from '#server/config/envConfig.mjs';

function getHash(stringData) {
    return crypto.createHash('sha256')
        .update(stringData, 'utf8')
        .digest('hex').toString();
}

function getUrlPath(hashin, inUrlPath, abTest, channel, country, language, paramsString) {
    const abTests = (abTest && abTest !== 'false' ? `abTest=${abTest}&` : '');
    const isSEO = (ENABLE_SEO ? '&isSEO=y' : '');
    const cachedParams = (paramsString && paramsString.length > 0 ? '&cachedQueryParams=' + encodeURIComponent(paramsString) : '');
    const hash = hashin ? hashin : '';

    return `/templateResolver?${hash}${abTests}channel=${channel}&country=${country}&language=${language}&urlPath=${encodeURIComponent(inUrlPath)}${cachedParams}${isSEO}`;
}

export {
    getHash,
    getUrlPath
};
