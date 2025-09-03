import {
    getHeader
} from '#server/utils/responseHeaders.mjs';

import {
    resolve,
    basename
} from 'path';

import {
    AGENT_AWARE_SITE_ENABLED
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function agentAwareMiddleware(request, response, next) {
    if (AGENT_AWARE_SITE_ENABLED) {
        const tier = getHeader(request.headers, 'agenttier');
        logger.info(`Agent Tier: ${tier}`);

        if (tier) {
            response.setHeader('agenttier', tier);
            request.apiOptions.headers['agenttier'] = tier;
        }
    }

    next();
}
