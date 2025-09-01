import {
    AGENT_AWARE_SITE_ENABLED,
    ENABLE_PREVIEW
} from '#server/config/envConfig.mjs';

import {
    ENABLE_MEMORY_CACHE,
    ENABLE_REDIS
} from '#server/config/envRouterConfig.mjs';

// we want to make sure that if we are on preview or aas that caching is disabled
// so if either is enabled then memory cache should NOT be enabled
// we also want to explicity enable memory cache either when we have REDIS enabled
// or when we tell it to explicity, which is the default
// router.sh disabled memory cache but can be enabled via option
const CACHE_COULD_BE_ENABLED = ENABLE_REDIS || ENABLE_MEMORY_CACHE;
const CACHE_SHOULD_BE_DISABLED = ENABLE_PREVIEW || AGENT_AWARE_SITE_ENABLED;
const CACHE_ENABLED = (CACHE_COULD_BE_ENABLED && !CACHE_SHOULD_BE_DISABLED);

function isGETRequest(options) {
    return (options && options.method && options.method === 'GET');
}

function getCacheItem(options, cacheKey, isMockedResponse, simpleCache) {
    let item;

    if (CACHE_ENABLED && (isGETRequest(options) || options.isCacheablePost)
        && cacheKey && !isMockedResponse) {
        const results = simpleCache.getCache(cacheKey);

        if (results) {
            item = results;
        }
    }

    return item;
}

export {
    CACHE_ENABLED,
    isGETRequest,
    getCacheItem
};
