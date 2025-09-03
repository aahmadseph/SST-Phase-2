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
import getSEOMetadata from '#server/services/api/seoService/graphql/seo.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    ERROR_404
} from '#server/services/utils/Constants.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function clientSidePage(request, response,
    templateName, targeters = {}, pageOptions = {}) {
    const urlPath = request.path,
        options = request.apiOptions;

    const apiCallList = [{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }];

    if (pageOptions.mediaId) {
        apiCallList.push({
            identifier: 'mediaAPI',
            apiFunction: getMedia,
            options: Object.assign({}, {
                mediaId: pageOptions.mediaId
            }, options)
        });
    } else if (pageOptions.cmsPath) {
        apiCallList.push({
            identifier: 'mediaAPI',
            apiFunction: getCMSPageData,
            options: Object.assign({}, options, {
                apiPath: pageOptions.cmsPath
            })
        });
    }

    // exclude SEO data for 404 error pages
    if (pageOptions.seoURL && !pageOptions.is404Page) {
        apiCallList.push({
            identifier: 'seoAPI',
            apiFunction: getSEOMetadata,
            options: Object.assign({}, {
                seoURL: pageOptions.seoURL
            }, options)
        });
    }

    PromiseHandler(apiCallList, (err, data) => {

        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const mediaAPI = (pageOptions.mediaId || pageOptions.cmsPath ? data.mediaAPI.success : {});
            const seoAPI = (pageOptions.seoURL ? data.seoAPI.success : {});
            const results = Object.assign({}, seoAPI, mediaAPI, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                enableNoindexMetaTag: (pageOptions.enableNoindexMetaTag !== false),
                enableNoFollowMetaTag: (pageOptions.enableNoFollowMetaTag === true),
                targeters,
                templateInformation: {
                    'template': templateName,
                    'channel': options.channel
                }
            });

            if (pageOptions && pageOptions.seoName && !pageOptions.is404Page) {
                results.seoCanonicalUrl = pageOptions.seoName || '/';
            } else if (pageOptions.is404Page) {
                results.seoCanonicalUrl = ERROR_404;
            }

            //require('fs').writeFileSync('tools/data/homepage.json',
            //    require('js-beautify').js_beautify(JSON.stringify(data)));
            const renderUrl = (pageOptions.is404Page ? ERROR_404 : urlPath);

            if (pageOptions.statusCode) {
                data.mergedHeaders.statusCode = pageOptions.statusCode;
            }

            ufeServiceCaller(renderUrl,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));
        } else {
            // do not call handleErrorResponse as that function calls clientSidePage
            sendErrorResponse(response, stringifyMsg(err), {
                sendErrorPage: true,
                statusCode: err.statusCode || 500
            });
        }

    });
}
