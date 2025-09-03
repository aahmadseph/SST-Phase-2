/* eslint class-methods-use-this: 0, no-shadow: 0 */
import {
    resolve,
    basename
} from 'path';

import {
    getErrorCode,
    getError,
    disconnect
} from '#server/framework/services/redis/redisUtils.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';

import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    REDIS_CONNECTION_RETRY_WAIT_TIME,
    REDIS_CONNECTION_RETRY_COUNT
} from '#server/config/envRouterConfig.mjs';
import {
    SECOND,
    MINUTE
} from '#server/config/TimeConstants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const FATAL_ERROR_CODES = ['DENIED', 'NR_CLOSED'],
    NONE_FATAL_ERROR_CODES = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'CLUSTERDOWN'];

class BaseRedisClient {

    constructor(options) {
        // clone config
        // not changing current config until all JERRI are in AKS
        this.redisOptions = {
            showFriendlyErrorStack: true,
            retryStrategy: this.retryStrategy,
            reconnectOnError: this.reconnectOnError,
            host: options.host,
            port: options.port
        };

        // given auth_pass set password
        if (options['auth_pass']) {
            this.redisOptions.password = `${options['auth_pass']}`;
        }

        // given prefix set keyPrefix
        this.keyPrefix = '*';

        if (options.prefix) {
            this.keyPrefix = options.prefix;
        }

        this.redisOptions.keyPrefix = this.keyPrefix;

        this.filterKeyName = options.filterKeyName || '/templateResolver?';

        // if we get SSL
        if (options.ssl) {
            this.redisOptions.ssl = true;
        }

        // for tls
        if (options.tls && options.tls.servername) {
            this.redisOptions.tls = {
                servername: options.tls.servername
            };
        }

        this.id = `${this.redisOptions.keyPrefix}-${this.redisOptions.host}:${this.redisOptions.port}`;

        this.isEnabled = false;

        this.intervalId = undefined;

        this.redisClient = {};

        this.asyncCommand = (command = '', ...args) => {
            const lcCommand = command.toLowerCase();
            logger.verbose(`Calling asyncCommand: ${lcCommand}`);

            return new Promise((resolve, reject) => {
                this.redisClient[lcCommand](...args, (err, success) => {
                    if (err) {
                        logger.debug(getError(err));
                        reject(err);
                    } else {
                        resolve(success);
                    }
                });
            });
        };
    }

    reconnectOnError(err) {

        logger.verbose(`Reconnect... ${stringifyMsg(err)}`);

        if (err.message) {
            const fatal = FATAL_ERROR_CODES.filter(code => {
                return (err.message.indexOf(code) > -1);
            });

            if (fatal && fatal.length > 0) {
                return false;
            }

            const errorType = NONE_FATAL_ERROR_CODES.filter(code => {
                return (err.message.indexOf(code) > -1);
            });

            if (errorType || errorType.length > 0) {
                return true;
            }
        }

        return true;
    }

    errorHandler(redisClient, clientId, err) {
        const errorCode = getErrorCode(err);

        if (errorCode && FATAL_ERROR_CODES.includes(errorCode)) {
            disconnect(redisClient);
            logger.error(`REDIS client: ${clientId} is disabled. Client error code: ${errorCode} and message: ${getError(err)}`);
        } else if (errorCode) {
            logger.error(`REDIS client: ${clientId} error code: ${errorCode} and message: ${getError(err)}`);
        } else {
            logger.error(`REDIS client: ${clientId} error message: ${getError(err)}`);
        }
    }

    retryStrategy(times) {

        logger.verbose(`Retry... ${times}`);

        if (times > REDIS_CONNECTION_RETRY_COUNT) {
            // slowly increase sleep time
            const timesOver = times - REDIS_CONNECTION_RETRY_COUNT;
            const multiplier = (timesOver > REDIS_CONNECTION_RETRY_COUNT ? MINUTE : SECOND);

            return REDIS_CONNECTION_RETRY_WAIT_TIME + (multiplier * timesOver);
        } else {
            return SECOND * times;
        }
    }


    isClientEnabled() {
        return this.isEnabled;
    }

    phset(redisKey, ...setArgs) {
        logger.verbose('Calling hset...');

        return this.asyncCommand('hset', redisKey, setArgs);
    }

    phgetall(key) {
        logger.verbose('Calling hgetall...');

        return this.asyncCommand('hgetall', key);
    }

    pexpireat(key, exptime) {
        logger.verbose('Calling expireat...');

        return this.asyncCommand('expireat', key, exptime);
    }

    pinfo() {
        logger.verbose('Calling info...');

        return this.asyncCommand('info');
    }

    async pxscan(client, maxSize, keyId = this.keyPrefix, cursor = 0, returnSet = []) {
        if (maxSize === 0) {
            return [];
        }

        const filterKeyName = this.filterKeyName;
        let resultSet = returnSet.concat([]);

        return client.scan(cursor, 'MATCH', `*${keyId}*`, 'COUNT', maxSize).then(keys => {
            const filterKey = key => (key.indexOf(filterKeyName) > -1);
            logger.verbose(`Got the following from scan ${keys[0]} ${keys[1].length}`);

            if (keys[0] && keys[0] > 0) {
                resultSet = resultSet.concat(keys[1].filter(filterKey));
                keys[1].forEach(filterKey);

                return this.pxscan(client, maxSize, keyId, keys[0], resultSet);
            }

            resultSet = resultSet.concat(keys[1].filter(filterKey));
            logger.verbose(`Final result count ${resultSet.length}`);

            return resultSet;
        }).catch(_e => {
            return [];
        });
    }

    async pxunlink(client, _prefix) {
        logger.verbose('Calling unlink...');
        const [err, maxSize] = await asyncWrapper(client.dbsize());

        if (!err) {
            const [pxerr, filteredKeys] = await asyncWrapper(this.pxscan(client, maxSize, this.keyPrefix));

            if (pxerr) {
                logger.verbose(stringifyMsg(pxerr));

                return 0;
            }

            if (filteredKeys.length === 0) {
                return 0;
            }

            filteredKeys.map(itemKey => {
                return itemKey.substring(this.keyPrefix.length);
            }).forEach(itemKey => {
                client.unlink(itemKey).catch(uerr => {
                    logger.verbose(stringifyMsg(uerr));
                });
            });

            // filteredKeys is the real length
            return filteredKeys.length;
        } else {
            return err;
        }
    }

    async pscan(_keyId = this.keyPrefix) {
        throw 'Not implemented!';
    }

    async pdbsize() {
        logger.verbose('Calling dbsize...');

        return this.pscan(this.keyPrefix).then(results => {
            if (!results && !Array.isArray(results)) {
                return 0;
            }

            const total = results.length;
            logger.verbose(`Total db size: ${total}`);

            return total;
        });
    }
}

export default BaseRedisClient;
