import querystring from 'node:querystring';
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';

import {
    flushCache
} from '#server/services/utils/apiRequest.mjs';
import {
    getBodyBuffer
} from '#server/services/utils/urlUtils.mjs';
import {
    CACHE_MANAGER_USERNAME,
    CACHE_MANAGER_PASSWORD
} from '#server/config/envRouterConfig.mjs';
import {
    clearConfigurationCache
} from '#server/services/utils/configurationCache.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

process.on('message', msg => {
    if (msg.request === 'purgeMemoryCache') {
        flushCache();
    }
});

function okResponse(response, partialKeys) {
    flushCache(partialKeys);
    clearConfigurationCache();
    process.send({
        'request': 'refreshConfigAPI'
    });
    logger.info(`Memory cache${partialKeys ? ' partially' : ''} flushed.`);
    response.writeHead(200, {});
    response.end('OK');
}

function unauthorized(response) {
    response.writeHead(403, {});
    response.end('OK');
}

function flushMemoryCache(request, response) {

    const postData = getBodyBuffer(request);

    if (!postData) {
        unauthorized(response);

        return;
    }

    // validate data is correct
    const urlData = querystring.parse(postData);

    if (!urlData.usrnm || !urlData.psswrd ||
        urlData.usrnm !== CACHE_MANAGER_USERNAME ||
        urlData.psswrd !== CACHE_MANAGER_PASSWORD) {
        unauthorized(response);

        return;
    }

    // authorization passed
    // so see if we have partial key or not
    const partialKeys = urlData.partialKeys;

    if (process.send) {
        process.send({
            'request': 'flushMemoryCache',
            'pid': process.pid,
            partialKeys
        });
        okResponse(response, partialKeys);

        return;
    }

    okResponse(response, partialKeys);
}


export {
    flushMemoryCache
};
