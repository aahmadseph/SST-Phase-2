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
import getSiteMapDepartments from '#server/services/api/catalog/categories/getSiteMapDepartments.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const SEO_URL = '/sitemap/departments';

export default function sitemapDepartments(request, response) {

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
        identifier: 'SiteMapDepartmentsAPI',
        apiFunction: getSiteMapDepartments,
        options
    }], (err, data) => {

        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const results = Object.assign({}, {
                allCategoriesList: data.SiteMapDepartmentsAPI.success
            }, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                seoCanonicalUrl: SEO_URL,
                templateInformation: {
                    'template': 'SiteMap/Departments',
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
