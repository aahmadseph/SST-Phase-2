import {
    resolve,
    basename
} from 'path';

import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    REDIS_CONNECTION_RETRY_WAIT_TIME,
    REDIS_CONNECTION_RETRY_COUNT,
    REDIS_CONNECTION_RESET_COUNT
} from '#server/config/envRouterConfig.mjs';
import {
    SECOND
} from '#server/config/TimeConstants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const REDIS_TOTAL_RETRY_TIME = REDIS_CONNECTION_RETRY_WAIT_TIME * REDIS_CONNECTION_RETRY_COUNT;

function getError(err) {
    let errorResult;

    if (err) {
        if (err.message) {
            errorResult = err.message.toString();
        } else if (err instanceof Buffer) {
            try {
                errorResult = Buffer.from(err).toString();
            } catch (e) {
                errorResult = stringifyMsg(err);
            }
        } else {
            errorResult = stringifyMsg(err);
        }
    }

    return errorResult;
}

function getMessage(msg = '') {
    let result;

    if (msg instanceof Buffer) {
        try {
            result = Buffer.from(msg).toString();
        } catch (e) {
            result = stringifyMsg(msg);
        }
    } else {
        result = stringifyMsg(msg);
    }

    return result;
}

function filterErrorMessage(err) {
    return Object.keys(err).filter(prop => {
        return (prop !== 'args');
    }).map(prop => {
        return {
            [prop]: err[prop]
        };
    }).reduce((acc, next) => {
        return Object.assign({}, acc, next);
    });
}

function logAndReject(reject, err, identifierFn) {
    const message = `REDIS ${identifierFn}: ${getError(err)}`;
    logger.error(message);
    reject(message);
}

function getErrorCode(err) {
    let errorCode;

    if (err) {
        if (err.origin && err.origin.code) {
            errorCode = err.origin.code;
        } else if (err.code) {
            errorCode = err.code;
        }
    }

    return errorCode;
}

function retryStrategy(retryOptions) {

    // retryOptions is something like this
    // attempt":1,"error":null,"total_retry_time":0,"times_connected":1}
    logger.verbose(`Retry... ${stringifyMsg(retryOptions)}`);

    if (!retryOptions.attempt) {
        // if there is no attempt, try again in a second
        logger.verbose('No attempts to retry yet, will wait a second.');

        return SECOND;
    }

    if (retryOptions.error) {
        logger.error(`REDIS connection error: ${stringifyMsg(retryOptions.error)}`);

        // retry error handling
        if (retryOptions.error.code === 'ECONNREFUSED' ||
            retryOptions.error.code === 'DENIED' ||
            retryOptions.error.code === 'NR_CLOSED') {

            if (retryOptions.attempt > REDIS_CONNECTION_RETRY_COUNT &&
                retryOptions['total_retry_time'] > REDIS_TOTAL_RETRY_TIME) {

                // we are here so it is time to end this process

                // this seems to pass existing error as error.origin
                const retryError = new Error(retryOptions.error.message);
                retryError.code = retryOptions.error.code;

                // too many retries or too long waiting
                return retryError;
            }

            // wait a minute
            return REDIS_CONNECTION_RETRY_WAIT_TIME;
        } else if (retryOptions.error.code === 'ETIMEDOUT' ||
            retryOptions.error.code === 'CLUSTERDOWN' ||
            retryOptions.error.code === 'ECONNRESET') {

            if (retryOptions.attempt > REDIS_CONNECTION_RESET_COUNT &&
                retryOptions['total_retry_time'] > REDIS_TOTAL_RETRY_TIME) {

                // we are here so it is time to end this process

                // this seems to pass existing error as error.origin
                const retryError = new Error(retryOptions.error.message);
                retryError.code = retryOptions.error.code;

                // too many retries or too long waiting
                return retryError;
            }

            // default wait see envRouterConfig.mjs
            // REDIS_CONNECTION_RETRY_WAIT_TIME => env variable
            return REDIS_CONNECTION_RETRY_WAIT_TIME;
        }
    }

    if (retryOptions['total_retry_time'] > REDIS_TOTAL_RETRY_TIME) {
        // see above for how this is calculated
        // also see envRouterConfig.mjs for defaults
        return REDIS_TOTAL_RETRY_TIME;
    }

    // we have tried more than we should (default is 10)
    // REDIS_CONNECTION_RETRY_COUNT => env variable
    if (retryOptions.attempt > REDIS_CONNECTION_RETRY_COUNT) {
        // default wait see envRouterConfig.mjs
        // REDIS_CONNECTION_RETRY_WAIT_TIME => env variable
        return REDIS_CONNECTION_RETRY_WAIT_TIME;
    }

    // default is wait a second
    return SECOND;
}

// this is what we do when a client disconnects
// important to remove all listeners
function disconnect(client) {
    client.isEnabled = false;
    client.removeAllListeners();
    clearInterval(client.intervalId);
    client.quit((err, res) => {
        if (err) {
            logger.error(`Client ${client.id} disconnected with error: ${stringifyMsg(err)}`);
        } else {
            logger.info(`Client ${client.id} disconnected with message: ${stringifyMsg(res)}`);
        }
    });
}

export {
    disconnect,
    getError,
    getMessage,
    getErrorCode,
    filterErrorMessage,
    retryStrategy,
    logAndReject
};
