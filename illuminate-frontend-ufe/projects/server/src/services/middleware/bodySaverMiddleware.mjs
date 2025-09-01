/* eslint-disable object-curly-newline */
import {
    WritableStream
} from '#server/libs/WritableStream.mjs';

import {
    resolve,
    basename
} from 'path';

import {
    getDiffTime,
    getMax,
    getError
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

let maxSaveTime = 0;

export function bodySaver(request, _response, next) {

    const method = request.method;

    if (method !== 'POST' && method !== 'PUT') {
        next();

        return;
    }

    const startTime = process.hrtime(),
        PostCollector = new WritableStream();

    request.pipe(PostCollector)
        .on('error', (err) => {
            logger.error(`Error occured while reading message body: ${getError(err)}.`);
            next();
        }).on('finish', () => {

            request.bodyBuffers = PostCollector.getBuffers();

            const saveTime = getDiffTime(startTime);
            maxSaveTime = getMax(maxSaveTime, saveTime);

            next();
        });
}

export function getBodySaverMetrics() {
    return {
        maxSaveTime
    };
}
