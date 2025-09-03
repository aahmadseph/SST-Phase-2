/* eslint class-methods-use-this: 0, object-curly-newline: 0, no-unused-vars: 0 */
// test helper monkeys
const EventEmitter = require('events');

const nodesData = `3a9088d45bd11f3410cea4fb3f0821ba259e43d6 192.168.1.2:7005@17005 slave bb752729903e35ffe826f70fbd120573fe92dc53 0 1598645829558 6 connected
d321021b7d6c74037ece7796e9d2d21ecd76b873 192.168 .1 .2: 7004 @17004 myself, slave 6 d565b920bdae1b2ea06c79f278f90535b93484e 0 1598645829000 5 connected
d414f03f081c1b4e6c473378e9f8c293b443e2bf 192.168 .1 .2: 7003 @17003 slave a2c2e4294f9fc7a84f8d89dc2d0ef0f2c203a37d 0 1598645829357 4 connected
6 d565b920bdae1b2ea06c79f278f90535b93484e 192.168 .1 .2: 7002 @17002 master - 0 1598645829055 3 connected 10923 - 16383
bb752729903e35ffe826f70fbd120573fe92dc53 192.168 .1 .2: 7000 @17000 master - 0 1598645829859 1 connected 0 - 5460
a2c2e4294f9fc7a84f8d89dc2d0ef0f2c203a37d 192.168 .1 .2: 7001 @17001 master - 0 1598645830361 2 connected 5461 - 10922`;

const redisOptions = {
    host: 'local.sephora.com',
    port: 6379,
    prefix: 'testframework',
    'auth_pass': 'a fake password',
    ssl: true,
    tls: {
        servername: 'local.sephora.com'
    }
};

const keysOne = [3, [
        `${redisOptions.prefix}/templateResolver?xfirst_key`,
        `${redisOptions.prefix}/templateResolver?xsecond_key`,
        `${redisOptions.prefix}/templateResolver?xthird_key`,
        'invalid_fourth_key',
        'invalid_fifth_key'
    ]], keysTwo = [5, [
        `${redisOptions.prefix}/templateResolver?first_key`,
        `${redisOptions.prefix}/templateResolver?second_key`,
        `${redisOptions.prefix}/templateResolver?third_key`,
        `${redisOptions.prefix}/templateResolver?fourth_key`,
        `${redisOptions.prefix}/templateResolver?fifth_key`
    ]], emptyNodes = [{
        status: 'ready',
        options: {
            host: redisOptions.host,
            port: 15000
        },
        dbsize: async (...args) => {
            return Promise.resolve(0);
        },
        scan: (...args) => {
            return Promise.resolve([]);
        }
    },
    {
        status: 'connecting',
        options: {
            host: redisOptions.host,
            port: 15001
        },
        dbsize: async (...args) => {
            return Promise.resolve(0);
        },
        scan: async(...args) => {
            return Promise.resolve([]);
        }
    }], deleteNode = [{
        status: 'ready',
        options: {
            host: redisOptions.host,
            port: 15000
        },
        unlink: (key) => {
            return Promise.resolve(1);
        }
    }];

class MockIORedisCluster extends EventEmitter {

    constructor(startupNodes = [], startOptions = {}) {
        super();
        this.success = true;
        this.resultData = {
            createTime: Date.now() - 1000,
            html: '<html></html>',
            hashKey: '12312312',
            gitBranch: 'Unknown-Local',
            buildNumber: 'BUFE-node.js'
        };
        this.startOptions = startOptions;
        this.startupNodes = startupNodes;
        setTimeout(() => {
            this.emit('connect');
            this.emit('ready');
        }, 100);
        this.keyPrefix = redisOptions.prefix;

        this.handler = (...args) => {
            const alen = args.length;

            if (typeof args[alen - 1] === 'function') {
                if (this.success) {
                    args[alen - 1](null, this.resultData);
                } else {
                    args[alen - 1](this.resultData);
                }
            }
        };
    }

    nodes(typeOfNode) {
        return [{
            status: 'ready',
            options: {
                host: this.startOptions.host,
                port: 15000
            },
            dbsize: async (...args) => {
                return Promise.resolve(keysOne[0]);
            },
            scan: (cursor, match, key, ...args) => {
                if (key && key === `*${this.keyPrefix}*`) {
                    const filterKeys = keysOne[1].
                        filter(item => item.indexOf(this.keyPrefix) > -1);

                    return Promise.resolve([0, filterKeys]);
                } else {
                    return Promise.resolve([0, keysOne[1]]);
                }
            },
            unlink: (key) => {
                return Promise.resolve(0);
            }
        },
        {
            status: 'connecting',
            options: {
                host: this.startOptions.host,
                port: 15001
            },
            dbsize: async (...args) => {
                return Promise.resolve(keysTwo[0]);
            },
            scan: async(cursor, match, key, ...args) => {
                if (key && key === `*${this.keyPrefix}*`) {
                    const filterKeys = keysTwo[1].
                        filter(item => item.indexOf(this.keyPrefix) > -1);

                    return Promise.resolve([0, filterKeys]);
                } else {
                    return Promise.resolve([0, keysTwo[1]]);
                }
            },
            unlink: (key) => {
                return Promise.resolve(0);
            }
        }];
    }

    hset(...args) {
        this.handler(...args);
    }

    hgetall(...args) {
        this.handler(...args);
    }

    expireat(...args) {
        this.handler(...args);
    }

    cluster(...args) {
        this.handler(...args);
    }

    info(...args) {
        this.handler(...args);
    }

    scan(...args) {
        return new Promise(resolve => {
            return resolve([0, keysOne[1].concat(keysTwo[1])]);
        });
    }

    removeAllListeners() {}
    quit(cb) {
        if (cb && typeof cb === 'function') {
            cb({
                code: 'DENIED',
                message: 'error occured'
            });
        }
    }
}

class MockIOErrorRedisCluster extends MockIORedisCluster {

    constructor(startupNodes = [], startOptions = {}) {
        super(startupNodes, startOptions);
        this.success = false;
    }
}


module.exports = {
    redisOptions,
    keysOne,
    keysTwo,
    emptyNodes,
    nodesData,
    deleteNode,
    MockIORedisCluster,
    MockIOErrorRedisCluster
};
