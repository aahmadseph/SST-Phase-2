import {
    resolve,
    basename
} from 'path';

import Redis from 'ioredis';

import BaseRedisClient from '#server/framework/services/redis/BaseRedisClient.mjs';
import {
    getError
} from '#server/framework/services/redis/redisUtils.mjs';
import {
    REDIS_PING_TIME
} from '#server/config/envRouterConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

class RedisClient extends BaseRedisClient {

    constructor(options) {
        super(options);

        this.redisClient = new Redis(this.redisOptions.port, this.redisOptions.host, this.redisOptions);

        this.redisClient.on('error', (err) => {
            this.errorHandler(this.redisClient, this.id, err);
        });

        this.redisClient.on('connect', () => {
            logger.info(`REDIS client ${this.id} is connected.`);
        });

        this.redisClient.on('ready', () => {
            this.isEnabled = true;
            this.intervalId = setInterval(() => {
                if (this.isEnabled) {
                    this.asyncCommand('ping').catch(err => {
                        logger.error('REDIS ping ' + getError(err));
                    });
                }
            }, REDIS_PING_TIME);
        });
    }

    async pdelete(keyId) {
        logger.verbose('Calling unlink...');

        return this.asyncCommand('unlink', keyId);
    }

    punlink(prefix) {
        logger.verbose('Calling unlink...');

        return this.pxunlink(this.redisClient, prefix);
    }

    async pscan(keyId = this.keyPrefix) {
        return this.redisClient.dbsize().then(maxSize => {
            return this.pxscan(this.redisClient, maxSize, keyId);
        }).catch(err => {
            logger.debug(stringifyMsg(err));

            return [];
        });
    }
}

export default RedisClient;
