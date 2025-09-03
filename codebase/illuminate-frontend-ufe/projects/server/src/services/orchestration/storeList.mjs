/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import storeList from '#server/services/api/util/fullStoreList.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import STORE_LOOKUP_TABLE from '#server/config/storeListConstants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const SEO_URL = '/happening/storelist';
const STORES = '/happening/stores/';

function groupStoresByState(storeItems, country, language) {
    const stateMap = {};
    if (!Array.isArray(storeItems)) {
        return stateMap;
    }

    const languageMap = STORE_LOOKUP_TABLE[country]?.[language] || STORE_LOOKUP_TABLE[country]?.['en'];

    for (const item of storeItems) {
        const node = item?.node;
        const storeName = node?.general?.storeName;
        const seoName = node?.general?.seoName;
        const address = node?.general?.primaryAddress;
        const stateAbbr = address?.state;
        const city = address?.city;
        const fullStateName = languageMap?.[stateAbbr] || stateAbbr;


        if (storeName && fullStateName && city) {
            if (!stateMap[fullStateName]) {
                stateMap[fullStateName] = [];
            }

            stateMap[fullStateName].push({
                storeName,
                seoName,
                city
            });
        } else {
            logger.warn(`Skipping malformed store item: ${stringifyMsg(item)}`);
        }
    }


    for (const state in stateMap) {
        if (Object.prototype.hasOwnProperty.call(stateMap, state)) {
            stateMap[state].sort((a, b) => a.city.localeCompare(b.city));
        }
    }

    return stateMap;
}

function transformForStoreListUI(grouped) {
    const result = {};
    const sortedStates = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

    for (const state of sortedStates) {
        const stores = grouped[state];
        result[state] = {
            stores: stores.map(store => {
                const toTitleCase = (str) => {
                    if (!str) {
                        return '';
                    }
                    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                };

                return {
                    displayName: `${toTitleCase(store.city)}, ${toTitleCase(store.storeName)}`,
                    targetUrl: `${STORES}${store.seoName}`
                };
            })
        };
    }
    return { states: result };
}

export default function storelist(request, response) {

    const options = request.apiOptions;

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'storeListAPI',
        apiFunction: storeList,
        options
    }], (err, data) => {

        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const allItems = data.storeListAPI.success?.data?.locations?.items || [];

            const usaSephoraResults = [];
            const usaKohlsResults = [];
            const canadaResults = [];

            for (const item of allItems) {
                const country = item?.node?.general?.primaryAddress?.country;
                const entity = item?.node?.analyticalParameters?.entityType;

                if (entity === 'SEPHORA' && country === 'USA') {
                    usaSephoraResults.push(item);
                } else if (entity === 'KOHLS' && country === 'USA') {
                    usaKohlsResults.push(item);
                } else if (entity === 'SEPHORA' && country === 'CAN') {
                    canadaResults.push(item);
                }
            }

            const usaStoresByState = groupStoresByState(usaSephoraResults, 'US', options.language);
            const kohlsStoresByState = groupStoresByState(usaKohlsResults, 'US', options.language);
            const canadaStoresByProvince = groupStoresByState(canadaResults, 'CA', options.language);

            const storeGroups = {
                'United States': transformForStoreListUI(usaStoresByState),
                'Sephora at Kohl\'s': transformForStoreListUI(kohlsStoresByState),
                'Canada': transformForStoreListUI(canadaStoresByProvince)
            };

            const results = Object.assign({}, { storeGroups }, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                seoCanonicalUrl: SEO_URL,
                enableNoindexMetaTag: false,
                templateInformation: {
                    'template': 'Store/CompleteStoreList',
                    'channel': options.channel
                }
            });

            ufeServiceCaller(SEO_URL,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));
        } else {
            handleErrorResponse(response, err.error);
        }
    });
}
