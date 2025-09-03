import {
    resolve,
    basename
} from 'path';
import getSeoRedirect from '#server/services/api/seoService/getSeoRedirect.mjs';
import { ENABLE_PREVIEW } from '#server/config/envConfig.mjs';
import { getConfigurationValue } from '#server/services/utils/configurationCache.mjs';
import { sendPermRedirect, sendTempRedirect } from '#server/utils/sendRedirect.mjs';
import { getError, stringifyMsg, safelyParse } from '#server/utils/serverUtils.mjs';
import { isHealthcheckURL, isNonePageRoute } from '#server/services/utils/routerUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);


export default function seoRedirectMiddleware(request, response, next) {
    const { apiOptions } = request;
    const url = apiOptions.apiPath;
    const isRedirectEnabled = getConfigurationValue(apiOptions, 'useNewRedirectMiddleware', false);
    const isAsset = isNonePageRoute(apiOptions.apiPath) || isHealthcheckURL(apiOptions.apiPath);

    if (ENABLE_PREVIEW && isRedirectEnabled && url && url !== '/' && url !== '/preview' && !isAsset) {
        const locale = `${apiOptions.language}-${apiOptions.country}`;
        const options = {
            ...request.apiOptions,
            url,
            locale
        };

        getSeoRedirect(options).then(redirectData => {
            const parsedRedirectData = safelyParse(redirectData.data);

            if (parsedRedirectData) {
                const { type, url } = parsedRedirectData.data;
                const redirectFunction = (Number(type) === 301) ? sendPermRedirect : sendTempRedirect;
                const message = stringifyMsg({
                    'Redirect_From_URL': url,
                    'Redirect_To_URL': url,
                    'statusCode': type
                });
                redirectFunction(response, message, url);

                return;
            } else {
                next();
            }
        }).catch(err => {
            logger.error(`SeoRedirect error ${getError(err)}`);
            next();
        });
    } else {
        next();
    }
}
