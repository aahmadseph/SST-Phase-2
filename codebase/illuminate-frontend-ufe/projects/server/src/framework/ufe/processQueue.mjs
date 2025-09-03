import {
    resolve,
    basename
} from 'path';

import {
    getRequestQueue,
    getWorkerBees
} from '#server/framework/ufe/ufeWorkers.mjs';
import {
    getDiffTime
} from '#server/utils/serverUtils.mjs';
import {
    passRequestToChild
} from '#server/framework/ufe/passRequestToChild.mjs';
import {
    logPromiseErrors
} from '#server/utils/sendOKResponse.mjs';
import {
    updateMaxTimeInRequestQueue
} from '#server/framework/ufe/status.mjs';
import {
    emitter
} from '#server/framework/ufe/UFEEventEmitter.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function processQueue(childIndex) {

    const workerBees = getWorkerBees();

    // when a worker crashes if this is called then we don't want to try to access
    // workerBees[childIndex] as it gets deleted
    if (workerBees[childIndex]) {
        if (getRequestQueue().length > 0) {
            logger.info(`Running next request in queue. requestQueue.length: ${getRequestQueue().length}`);

            // Remove the first passRequestToChild function from requestQueue and run it
            const rqObj = getRequestQueue().shift();
            const {
                requestData,
                cacheAbleRequest,
                queryData
            } = rqObj;

            // track how long a process has spent in the queue waiting
            const requestQueueEntryTime = getDiffTime(requestData.headers['queue-entry-time']);
            updateMaxTimeInRequestQueue(requestQueueEntryTime);

            requestData.headers['queue-time'] = requestQueueEntryTime;

            // check here to see if rendered already
            passRequestToChild(childIndex, requestData, cacheAbleRequest, queryData, emitter)
                .then(processQueue, logPromiseErrors);
        } else {
            logger.info(`Worker bee completed work and has been freed ${childIndex}.`);
            workerBees[childIndex].busy = false;

            // remove requestUrl as this worker is done
            delete workerBees[childIndex].requestUrl;
            delete workerBees[childIndex].sendStartTime;
        }
    }

    return null;
}
