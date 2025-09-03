/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';
import {
    sendTempRedirect,
    sendPermRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    safelyParse
} from '#server/utils/serverUtils.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const specialLayoutTypes = [
    { url: '/beautyinsider',
        layout: 'LayoutBeautyInsider' },
    { url: '/rewards',
        layout: 'LayoutRewardsBazaar' },
    { url: '/beauty/skin-analysis-tool',
        layout: 'LayoutARSkincare' }
];

const NO_INDEX_NO_FOLLOW_PAGES = [
    '/beauty/employee-privacy-policy'
];

function contentPages(request, response, contentPageData) {
    const urlPath = request.apiOptions.apiPath,
        options = request.apiOptions,
        redirect = contentPageData.data?.redirect;

    options.channel = CHANNELS.RWD;

    if (redirect) {
        const newLocation = redirect.url,
            statusCode = Number(redirect.type),
            logData = `Redirecting to: ${newLocation} with status code ${statusCode}`;

        // need to redirect
        if (statusCode === 302) {
            sendTempRedirect(response, logData, newLocation);

            return;
        }

        if (statusCode === 301) {
            sendPermRedirect(response, logData, newLocation);

            return;
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
    }], (err, data) => {

        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const results = Object.assign({
                content: contentPageData.data
            }, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                templateInformation: {
                    'template': 'Content/Content',
                    'channel': options.channel
                }
            });

            ufeServiceCaller(urlPath,
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

export default function lookupContentPages(request, response, contentfulBccSwitch=null) {
    const options = request.apiOptions;

    const { bccFallback = null, contentfulRedirect = null } = (
        typeof contentfulBccSwitch === 'function' && contentfulBccSwitch()
    ) || {};

    const getBccContentPage = () => {
        if (bccFallback && typeof bccFallback === 'function') {
            bccFallback();
        } else {
            sendPermRedirect(response, `Request made for page ${request.apiOptions.apiPath}`, '/');
        }
    };

    getCMSPageData({
        channel: CHANNELS.RWD,
        ...options
    }).then(cmsResponseData => {
        const contentData = safelyParse(cmsResponseData.data);

        if (contentData.data) {
            /*
                TODO - After spike ECS-6827 is played, will remove the hardcoded logic
                to enable noindex and nofollow for a content page.
            */
            const isNoIndexNoFollowPage = NO_INDEX_NO_FOLLOW_PAGES.includes(request.apiOptions.apiPath?.toLowerCase());
            contentData.data.enableNoindexMetaTag = isNoIndexNoFollowPage;
            contentData.data.enableNoFollowMetaTag = isNoIndexNoFollowPage;

            if (contentfulRedirect && typeof contentfulRedirect === 'function') {
                contentfulRedirect();
            } else {
                const hasSpecialLayout = specialLayoutTypes.find(layout => layout.url === request.apiOptions.apiPath?.toLowerCase());

                if (hasSpecialLayout) {
                    if (!contentData.data.layout) {
                        contentData.data.layout = {
                            type: hasSpecialLayout.layout
                        };
                    } else {
                        contentData.data.layout.type = hasSpecialLayout.layout;
                    }
                }

                contentPages(request, response, contentData);
            }
        } else if (!contentData.data) {
            logger.debug(`CMS API called and completed with empty data: ${request.apiOptions.apiPath?.toLowerCase()}`);
            getBccContentPage();
        }
    }).catch(() => {
        logger.debug(`CMS API called and failed to load response: ${request.apiOptions.apiPath?.toLowerCase()}`);
        getBccContentPage();
    });
}
