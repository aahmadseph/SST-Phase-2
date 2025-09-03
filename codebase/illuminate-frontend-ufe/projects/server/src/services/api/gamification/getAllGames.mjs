import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    withSdnToken
} from '#server/services/api/oauth/sdn/withSdnToken.mjs';
import {
    CACHE_THIRTY_MINUTES
} from '#server/services/utils/cacheTimes.mjs';
import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

function getAllGames(options) {
    const {
        userId,
        sdnAccessToken
    } = options;
    let requestUrl = '/v1/game/all';
    const apiOptions = {
        ...options,
        retryCount: 3,
        retryResponseCodes: [502]
    };

    if (userId) {
        requestUrl = `${requestUrl}?loyaltyId=${userId}`;
    } else {
        const cacheKey = `${requestUrl}?ch=${options.channel}&loc=${options.language}-${options.country}`;
        apiOptions.cacheKey = cacheKey;
        apiOptions.cacheTime = CACHE_THIRTY_MINUTES;
    }

    const headers = {
        'x-country-code': options.country,
        'x-source': options.channel,
        'x-locale': options.language,
        'x-request-timestamp': `${Date.now()}`,
        authorization: `Bearer ${sdnAccessToken}`
    };

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, requestUrl, 'GET', apiOptions, {}, headers);
}

export default withSdnToken(getAllGames);
