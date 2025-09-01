import {
    resolve,
    basename
} from 'path';

import {
    isHealthcheckURL
} from '#server/services/utils/routerUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function healthCheckMiddleware(request, _response, next) {

    const {
        headers,
        path: urlPath
    } = request;

    const userAgent = headers?.['User-Agent'];

    if (userAgent && urlPath === '/') {
        if (userAgent.startsWith('python-requests/') || userAgent.startsWith('Keeper/') ||
            userAgent.startsWith('Spark/')) {

            request.apiOptions.isHealthcheck = true;
            logger.info(`Bot like request from user-agent: ${userAgent}`);
        }
    } else if (isHealthcheckURL(urlPath)) {
        request.apiOptions.isHealthcheck = true;
    }

    next();
}
