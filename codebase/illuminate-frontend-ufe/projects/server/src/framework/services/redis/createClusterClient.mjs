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
    REDIS_PING_TIME,
    REDIS_SLOTS_TIMEOUT
} from '#server/config/envRouterConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

class ClusterClient extends BaseRedisClient {

    constructor(options) {
        super(options);

        // whole config for cluster
        const clusterOptions = {
            clusterRetryStrategy: this.retryStrategy,
            slotsRefreshTimeout: REDIS_SLOTS_TIMEOUT,
            slotsRefreshInterval: REDIS_SLOTS_TIMEOUT,
            scaleRedis: 'slaves',
            redisOptions: this.redisOptions,
            keyPrefix: this.redisOptions.keyPrefix
        };

        if (options.natMap) {
            clusterOptions.natMap = options.natMap;
        }

        logger.debug(`REDIS Cluster options: ${stringifyMsg(clusterOptions)}.`);

        this.redisClient = new Redis.Cluster([{
            port: this.redisOptions.port,
            host: this.redisOptions.host
        }], clusterOptions);

        this.redisClient.on('error', (err) => {
            this.errorHandler(this.redisClient, this.id, err);
        });

        this.redisClient.on('connect', () => {
            logger.info(`REDIS client ${this.id} is connected.`);
            const allNodes = this.redisClient.nodes('all');
            allNodes.forEach(node => {
                if (node.status.indexOf('connect') > -1) {
                    const nodeOps = node.options;
                    const hostIP = `${nodeOps.host}:${nodeOps.port}`;
                    logger.info(`REDIS cluster ${this.id} node ${hostIP} is ${node.status}.`);
                }
            });
        });

        this.redisClient.on('ready', () => {
            logger.info(`REDIS client ${this.id} is ready.`);
            this.isEnabled = true;
            this.intervalId = setInterval(() => {
                if (this.isEnabled) {
                    this.asyncCommand('ping').catch(err => {
                        logger.error('REDIS ping ' + getError(err));
                    });
                }
            }, REDIS_PING_TIME);
            const allNodes = this.redisClient.nodes('all');
            allNodes.forEach(node => {
                if (node.status.indexOf('ready') > -1) {
                    const nodeOps = node.options;
                    const hostIP = `${nodeOps.host}:${nodeOps.port}`;
                    logger.info(`REDIS cluster ${this.id} node ${hostIP} is ready to accept clients.`);
                }
            });
        });
    }

    async pdelete(keyId) {
        logger.verbose('Calling unlink...');
        const mainNodes = this.redisClient.nodes('all');

        return Promise.all(mainNodes.map(node => {
            return node.unlink(`${keyId}`)
                .catch(_e => {
                    return 0;
                });
        })).then(results => {
            if (!results && !Array.isArray(results)) {
                return 0;
            }

            const total = results.reduce((acc, next) => {
                return (+acc + +next);
            });
            logger.verbose(`Total unlinked: ${total}`);

            return total;
        });
    }

    punlink(prefix) {
        const mainNodes = this.redisClient.nodes('master');

        return Promise.all(mainNodes.map(async node => {
            return this.pxunlink(node, prefix);
        })).then(results => {
            if (!results || !Array.isArray(results)) {
                return 0;
            }

            return results.reduce((acc, next) => {
                return +acc + +next;
            });
        });
    }

    async pscan(keyId = this.keyPrefix) {
        logger.verbose('Calling scan...');
        const mainNodes = this.redisClient.nodes('master');

        return Promise.all(mainNodes.map(async node => {

            return node.dbsize().then(maxSize => {
                return this.pxscan(node, maxSize, keyId);
            }).catch(err => {
                logger.debug(stringifyMsg(err));

                return [];
            });
        })).then(results => {
            logger.silly(stringifyMsg(results));

            if (!results || !Array.isArray(results)) {
                return [];
            }

            const allKeys = results.filter(item => {
                return (item && Array.isArray(item) && item.length > 0);
            });

            if (allKeys.length === 0) {
                return [];
            }

            const filteredKeys = allKeys.reduce((acc, next) => {
                return acc.concat(next);
            });

            return Array.from(new Set(filteredKeys));
        });
    }

    pclusterInfo() {
        logger.verbose('Calling cluster info...');

        return this.asyncCommand('cluster', 'INFO');
    }
}

export default ClusterClient;
