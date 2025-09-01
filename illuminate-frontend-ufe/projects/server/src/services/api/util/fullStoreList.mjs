/* eslint-disable object-curly-newline */
import { sdnGraphQLRequest } from '#server/services/utils/apiRequest.mjs';
import { CACHE_FOUR_HOURS } from '#server/services/utils/cacheTimes.mjs';
import { stringifyMsg } from '#server/utils/serverUtils.mjs';
import { getConfigurationValue } from '#server/services/utils/configurationCache.mjs';
import { getSDNGraphQLHeaders } from '#server/services/utils/apiHeaders.mjs';

function getLocationsPayload() {
    const query = `
      query CompleteStoreList {
        locations(
            disablePagination: true
            filter: {
                countryCode: [USA, CAN]
                entityType: [SEPHORA, KOHLS]
                operationalStatus: [OPEN, TEMPORARILY_CLOSED]
            }
        ) {
            items {
                node {
                    general {
                        storeName
                        seoName
                        primaryAddress {
                            state
                            city
                            country
                        }
                    }
                    analyticalParameters {
                        entityType
                    }
                }
            }
        }
      }
    `;

    const payload = {
        query,
        variables: {},
        operationName: 'CompleteStoreList'
    };
    return stringifyMsg(payload);
}

async function getFullStoreList(options) {
    const apiKey = getConfigurationValue(options, 'sdnUfeAPIUserKey', undefined);
    if (!apiKey) {
        return Promise.reject('No API key!');
    }

    const headers = getSDNGraphQLHeaders(options.sdnAccessToken, 'UFE_SERVER', apiKey);

    const payload = getLocationsPayload();
    const cacheOptions = {
        ...options,
        cacheTime: CACHE_FOUR_HOURS,
        isCacheablePost: true,
        cacheKey: `/v1/graph/storelist?key=ALL_STORES_${options.country}${options.language}${options.channel}`
    };

    return sdnGraphQLRequest(cacheOptions, payload, headers);
}

export default getFullStoreList;
