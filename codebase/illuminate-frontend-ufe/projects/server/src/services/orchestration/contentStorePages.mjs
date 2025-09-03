/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import getMedia from '#server/services/api/catalog/media/getMedia.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import samples from '#server/services/api/util/samples.mjs';
import getSamples from '#server/services/api/util/getSamples.mjs';
import {
    urlMappingUtils
} from '#server/services/utils/urlMappingUtils.mjs';
import seo from '#server/services/api/util/seo.mjs';
import * as seoUtils from '#server/services/utils/seoUtils.mjs';

import {
    mapApiResponseToApiOptions
} from '#server/services/utils/urlUtils.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    stringifyMsg,
    safelyParse
} from '#server/utils/serverUtils.mjs';
import {
    getConfigurationValue
} from '#server/services/utils/configurationCache.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

function lookup(contentStoreUrl, response, options) {

    function processResults(err, data) {

        // TODO better handling errors like when the JSON
        // contains errorCode
        logger.debug(`Services called and completed with error? ${err}`);

        if (err) {
            sendErrorResponse(response, stringifyMsg(err));

            return;
        }

        logger.debug(`All API calls resolved with success! ${contentStoreUrl} ${options.mediaId}`);
        //console.log(data.contentStoresAPI);
        const contentStoreData = data.mediaAPI.success;
        const templateUrl = contentStoreData.templateUrl.trim();
        delete contentStoreData.templateUrl;

        logger.debug(`Template URL for content store? ${templateUrl}`);

        let template = options.channel === CHANNELS.RWD ?
            'ContentStore/RwdContentStore' :
            'ContentStore/ContentStore';

        if (templateUrl === 'ContentStore/BrandLaunch' ||
            templateUrl === 'ContentStore/OrderStatus' ||
            templateUrl === 'ContentStore/ContentStoreNoNav') {
            template = templateUrl;
        }

        const pageType = options.channel === CHANNELS.RWD ? {
            contentStoreData
        } :
            contentStoreData;

        if (templateUrl !== 'Samples/Samples') {
            const results = Object.assign({}, pageType, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                templateInformation: {
                    'template': template,
                    'channel': options.channel
                }
            });
            //require('fs').writeFileSync('categories.json',
            //    require('js-beautify').js_beautify(JSON.stringify(categories)));
            ufeServiceCaller(contentStoreUrl,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));

        } else {
            // make one more call
            template = templateUrl;
            const isPRSServiceEnabled = getConfigurationValue(options, 'isPRSServiceEnabled', false);

            const samplesAPI = isPRSServiceEnabled ? getSamples : samples;
            samplesAPI(options).then(samplesData => {

                const results = Object.assign({}, safelyParse(samplesData.data), contentStoreData, {
                    apiConfigurationData: data.configurationAPI.success
                }, {
                    headerFooterTemplate: data.headerFooterAPI.success
                }, {
                    templateInformation: {
                        'template': template,
                        'channel': options.channel
                    }
                });
                //require('fs').writeFileSync('categories.json',
                //    require('js-beautify').js_beautify(JSON.stringify(categories)));
                ufeServiceCaller(contentStoreUrl,
                    results,
                    response,
                    Object.assign({}, options, {
                        cacheable: true,
                        responseHeaders: data.mergedHeaders
                    }));

            }).catch(e => {
                sendErrorResponse(response, stringifyMsg(e));
            });
        }
    }

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'mediaAPI',
        apiFunction: getMedia,
        options: options
    }], processResults);
}

// url mapping for this should contain /beauty/
export default async function contentStorePages(request, response) {

    let contentStoreUrl = request.apiOptions.apiPath;
    const options = request.apiOptions;

    if (contentStoreUrl.endsWith('/')) {
        contentStoreUrl = contentStoreUrl.slice(0, -1);
    }

    const contentUrl = contentStoreUrl.replace(/\/beauty\//, '');

    // options specific to the lookup
    const seoLookupOptions = Object.assign({}, options, {
        seoName: contentStoreUrl.replace(/^\//, '')
    });

    const [seoErr, results] = await asyncWrapper(seo(seoLookupOptions));

    if (seoErr) {
        sendErrorResponse(response, stringifyMsg(seoErr));

        return;
    }

    const seoData = safelyParse(results.data);
    // figure out if we have a redirect
    const seoResults = seoUtils.getSeoURL(contentStoreUrl, seoData);

    if (seoResults.error) {
        sendTempRedirect(response, stringifyMsg(results));

        return;
    }

    // the seo lookup shows we have a redirectUrl and a status code
    // let's make sure we are not going to redirect to this same page
    if (seoResults.redirectUrl && seoResults.statusCode &&
        (!seoResults.redirectUrl.startsWith(contentUrl) &&
            !seoResults.redirectUrl.startsWith(contentStoreUrl))) {
        // need to redirect
        logger.verbose(`Redirecting to: ${seoResults.redirectUrl} with status code ${seoResults.statusCode}`);
        response.writeHead(seoResults.statusCode, {
            location: seoResults.redirectUrl
        });
        response.end();

        return;
    }

    // if we are here we are pretty sure we are a content store page
    // but let's double check a few things
    // page type 2 and 3 should have been handled already
    if (seoData.type !== seoUtils.UNIFIED_CONTENT_STORE &&
        seoData.type !== seoUtils.RWD_CONTENT_STORE) {
        sendTempRedirect(response);

        return;
    }

    const urlMappingOptions = Object.assign({}, options, {
        pathname: contentUrl
    });

    // before calling url mapping lets update the options to be
    mapApiResponseToApiOptions(request, results.headers, urlMappingOptions);
    const [mappingErr, mappingResults] = await asyncWrapper(urlMappingUtils(response, urlMappingOptions));

    if (mappingErr) {
        sendErrorResponse(response, stringifyMsg(mappingErr), {
            sendErrorPage: true,
            statusCode: mappingErr.statusCode || 500
        });

        return;
    }

    if (mappingResults) {
        options.mediaId = seoData.targetValue.split(';')[0];
        mapApiResponseToApiOptions(request, mappingResults.headers, options);
        lookup(contentStoreUrl, response, options);
    }
}
