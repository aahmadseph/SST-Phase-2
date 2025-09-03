import {
    DISABLE_REDIS_CLUSTER_MODE,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_AUTH_PASS,
    REDIS_PREFIX,
    REDIS_USE_SSL,
    REDIS_NATMAP
} from '#server/config/envRouterConfig.mjs';

const redisConfig = {
    'host': REDIS_HOST || '172.17.0.3',
    'port': REDIS_PORT || 7000
};

if (REDIS_AUTH_PASS) {
    redisConfig['auth_pass'] = REDIS_AUTH_PASS;
}

if (REDIS_PREFIX) {
    redisConfig['prefix'] = REDIS_PREFIX;
}

if (REDIS_USE_SSL) {
    redisConfig['ssl'] = true;
    redisConfig['tls'] = {
        'servername': redisConfig.host
    };
}

if (DISABLE_REDIS_CLUSTER_MODE) {
    redisConfig['clusterMode'] = false;
} else {
    redisConfig['clusterMode'] = true;
}

if (REDIS_NATMAP) {
    redisConfig['natMap'] = {
        '172.17.0.2:7000': {
            host: '127.0.0.1',
            port: 7000
        },
        '172.17.0.2:7001': {
            host: '127.0.0.1',
            port: 7001
        },
        '172.17.0.2:7002': {
            host: '127.0.0.1',
            port: 7002
        },
        '172.17.0.2:7003': {
            host: '127.0.0.1',
            port: 7003
        },
        '172.17.0.2:7004': {
            host: '127.0.0.1',
            port: 7004
        },
        '172.17.0.2:7005': {
            host: '127.0.0.1',
            port: 7005
        }
    };
}

export default redisConfig;
