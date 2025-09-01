describe('createClusterClient', function () {

    const BUILD_INFO = {
        'BUILD_NUMBER': 'UFE-node.js',
        'PROJECT_VERSION': 'Unknown-Local',
        'CODE_BRANCH': 'Unknown-Local',
        'BUILD_DATE': new Date().toString(),
        'GIT_BRANCH': 'Unknown-Local',
        'GIT_COMMIT': 'Unknown-Local'
    };

    process.env.BUILD_INFO = BUILD_INFO;

    const {
            redisOptions,
            keysOne,
            keysTwo,
            emptyNodes,
            deleteNode,
            nodesData,
            MockIORedisCluster
        } = require('#tests/mocks/moduleHelpers.js'),
        createClusterClientPath = '#server/framework/services/redis/createClusterClient.mjs';

    let client,
        listener;

    beforeEach(async() => {

        const res = await import(createClusterClientPath);
        const ClusterClient = res.default;

        client = new ClusterClient(redisOptions);
        
        listener = client.redisClient.listeners('ready')[0];
        // we don't want something running
        if (client.redisClient.disconnect) {
            client.redisClient.disconnect();
        }
        client.redisClient = new MockIORedisCluster(nodesData, redisOptions);
    });

    it('call cluster client constructor', () => {
        expect(client).toBeDefined();
    });

    it('call phset', (done) => {
        client.redisClient.resultData = 'something';
       
        client.phset('abc123', {
            'hashKey': 'abc1234123',
            'html': 'some html would be here',
            'compressed': true,
            'buildNumber': 'B12345',
            'gitBranch': 'asdfasdfasdfasdf'
        }).then(results => {
            expect(results).toEqual(client.redisClient.resultData);
            done();
        });
    });

    it('call phset with error', (done) => {
        client.redisClient.success = false;
        client.redisClient.resultData = 'something';

        client.phset('abc123', {
            'hashKey': 'abc1234123',
            'html': 'some html would be here',
            'compressed': true,
            'buildNumber': 'B12345',
            'gitBranch': 'asdfasdfasdfasdf'
        }).catch(results => {
            expect(results).toEqual(client.redisClient.resultData);
            done();
        });
    });

    it('call phgetall', (done) => {
        client.redisClient.resultData = {
            'hashKey': 'abc1234123',
            'html': 'some html would be here',
            'compressed': true,
            'buildNumber': 'B12345',
            'gitBranch': 'asdfasdfasdfasdf'
        };

        client.phgetall('abc123').then(results => {
            expect(results.html).toEqual(client.redisClient.resultData.html);
            done();
        });
    });

    it('call pexpireat', (done) => {
        client.redisClient.resultData = 'something';

        client.pexpireat('abc123').then(results => {
            expect(results).toEqual(client.redisClient.resultData);
            done();
        });
    });

    it('call pclusterInfo', (done) => {
        client.redisClient.resultData = 'something';

        client.pclusterInfo().then(results => {
            expect(results).toEqual(client.redisClient.resultData);
            done();
        });
    });

    it('call pinfo', (done) => {
        client.redisClient.resultData = 'something';

        client.pinfo().then(results => {
            expect(results).toEqual(client.redisClient.resultData);
            done();
        });
    });

    it('call pscan', (done) => {
        client.redisClient.resultData = (keysOne[1].concat(keysTwo[1])).filter(key => {
            return key.startsWith(redisOptions.prefix);
        });

        client.pscan().then(results => {
            expect(results).toEqual(client.redisClient.resultData);
            done();
        });
    });

    it('call pdbsize', (done) => {
        client.redisClient.resultData = (keysOne[1].concat(keysTwo[1])).filter(key => {
            return key.startsWith(redisOptions.prefix);
        });

        client.pdbsize().then(results => {
            expect(results).toEqual(client.redisClient.resultData.length);
            done();
        });
    });

    it('call pdbsize is zero', (done) => {
        spyOn(client.redisClient, 'nodes').and.callFake(() => {
            return emptyNodes;
        });

        client.pdbsize().then(results => {
            expect(results).toEqual(0);
            done();
        });
    });

    it('call punlink', (done) => {
        client.redisClient.resultData = (keysOne[1].concat(keysTwo[1])).filter(key => {
            return key.startsWith(redisOptions.prefix);
        });

        client.punlink().then(results => {
            expect(results).toEqual(client.redisClient.resultData.length);
            done();
        });
    });

    it('call pdelete', (done) => {
        spyOn(client.redisClient, 'nodes').and.callFake(() => {
            return deleteNode;
        });

        client.pdelete(keysOne[1][1]).then(results => {
            expect(results).toEqual(1);
            done();
        });
    });

    it('raise error ETIMEDOUT', (done) => {
        client.redisClient.on('error', (error) => {
            expect(error.code).toBeDefined();
            done();
        });

        client.redisClient.emit('error', {
            code: 'ETIMEDOUT',
            message: 'this is only a test'
        });
    });

    it('raise error DENIED', (done) => {
        client.redisClient.on('error', (error) => {
            expect(error.code).toBeDefined();
            done();
        });

        client.redisClient.emit('error', {
            code: 'DENIED',
            message: 'this is only a fatal test'
        });
    });

    it('reconnecting', (done) => {
        client.redisClient.on('reconnecting', (error) => {
            expect(error.code).toBeDefined();
            done();
        });

        client.redisClient.emit('reconnecting', {
            code: 'ETIMEDOUT',
            message: 'this is only a connection test'
        });
    });

    it('retryStrategy wait time is second', async () => {
        const {
            SECOND
        } = await import('#server/config/TimeConstants.mjs');

        const retryStrategy = client.redisClient.startOptions?.redisOptions?.retryStrategy || client.retryStrategy;
        expect(retryStrategy.call(client, 1)).toEqual(SECOND);
    });

    it('retryStrategy wait time is REDIS_CONNECTION_RETRY_WAIT_TIME', async () => {
        const {
            REDIS_CONNECTION_RETRY_WAIT_TIME,
            REDIS_CONNECTION_RETRY_COUNT
        } = await import('#server/config/envRouterConfig.mjs');

    const retryStrategy = client.redisClient.startOptions?.redisOptions?.retryStrategy || client.retryStrategy;
        expect(retryStrategy.call(client, REDIS_CONNECTION_RETRY_COUNT + 1)).toBeGreaterThan(REDIS_CONNECTION_RETRY_WAIT_TIME);
    });

    it('reconnectOnError', () => {
        const reconnectOnError = client.redisClient.startOptions?.redisOptions?.reconnectOnError || client.reconnectOnError;
        expect(reconnectOnError({
            code: 'CLUSTERDOWN',
            message: 'not really down'
        })).toBeTruthy();
    });

    it('reconnectOnError but dont first', () => {
        const reconnectOnError = client.redisClient.startOptions?.redisOptions?.reconnectOnError || client.reconnectOnError;
        expect(reconnectOnError({
            code: 'ECONNREFUSED',
            message: 'now really down'
        })).toBeTruthy();
    });

    it('reconnectOnError but dont second', () => {
        const reconnectOnError = client.redisClient.startOptions?.redisOptions?.reconnectOnError || client.reconnectOnError;
        expect(reconnectOnError.call(client, {
            code: 'ECONNREFUSED',
            message: 'now really down ECONNREFUSED'
        })).toBeTruthy();
    });

    it('reconnectOnError but dont', () => {
        const reconnectOnError = client.redisClient.startOptions?.redisOptions?.reconnectOnError || client.reconnectOnError;
        expect(reconnectOnError('now really down and weird stuff happening')).toBeTruthy();
    });

    it('isClientEnabled should be true', () => {
        listener.call(client);

        expect(client.isClientEnabled()).toBeTruthy();
    });
});
