/* eslint indent: 0 */
describe('redisWrapper', () => {

    const sleepyTime = (delay) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    };

    const baseDir = process.cwd(),
        {
            redisOptions,
            nodesData,
            MockIORedisCluster,
            MockIOErrorRedisCluster
        } = require('#tests/mocks/moduleHelpers.js');

    const redisWrapperPath = '#server/services/utils/redisWrapper.mjs';

    describe('success', () => {

        let redisWrapper;

        beforeEach(async () => {
            const Redis = require('ioredis');
            spyOnProperty(Redis, 'Cluster', 'get').and.callFake(() => {
                return MockIORedisCluster;
            });

            redisWrapper = await import(redisWrapperPath);
            redisWrapper.setupRedis({});
            // we don't want something running
            if (redisWrapper.getRedisHandle().redisClient.disconnect) {
                redisWrapper.getRedisHandle().redisClient.disconnect();
            }
            redisWrapper.getRedisHandle().redisClient = new MockIORedisCluster(nodesData, redisOptions);
        });

        it('redisWrapper createClient', async () => {

            await sleepyTime(200);
            const client = redisWrapper.getRedisHandle();
            expect(client).toBeDefined();
        });

        it('redisWrapper call fetch', async () => {

            const mySpy = spyOn(redisWrapper, 'fetch').and.callThrough();
            await sleepyTime(200);

            const results = await mySpy('1234', '12312312');
            expect(results).toBeDefined();
        });

        it('redisWrapper call fetch mismatched hash', async () => {

            const mySpy = spyOn(redisWrapper, 'fetch').and.callThrough();
            await sleepyTime(200);

            const results = await mySpy('1234', '2222');
            expect(results).toBeUndefined();
        });

        it('redisWrapper call setItem', async () => {

            const mySpy = spyOn(redisWrapper, 'setItem').and.callThrough();
            await sleepyTime(200);

            await mySpy('1234', {
                'hashKey': '12312312',
                'html': '<html><doc goes here</html>',
                'compressed': false,
                'createTime': new Date().getTime(),
                'buildNumber': 'BUFE-node.js',
                'gitBranch': 'Unknown-Local'
            });
            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call setCacheExpirationTime', async () => {

            const mySpy = spyOn(redisWrapper, 'setCacheExpirationTime').and.callThrough();
            await sleepyTime(200);

            mySpy('1234', 2 * 3600 * 1000);

            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call dbsize', async () => {

            const mySpy = spyOn(redisWrapper, 'getDbsize').and.callThrough();
            await sleepyTime(200);

            mySpy();

            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call flushAll', async () => {

            const mySpy = spyOn(redisWrapper, 'flushAll').and.callThrough();
            await sleepyTime(200);

            mySpy();

            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call getAllKeys', async () => {

            const mySpy = spyOn(redisWrapper, 'getAllKeys').and.callThrough();
            await sleepyTime(200);

            mySpy();

            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call deleteItem', async () => {

            const mySpy = spyOn(redisWrapper, 'deleteItem').and.callThrough();
            await sleepyTime(200);

            mySpy('/templateResolver?*');

            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper getStats', async () => {

            const mySpy = spyOn(redisWrapper, 'getRedisMetrics').and.callThrough();
            await sleepyTime(200);
            mySpy();
            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper isRedisEnabled', async () => {

            const mySpy = spyOn(redisWrapper, 'isRedisEnabled').and.callThrough();
            await sleepyTime(200);
            mySpy();
            expect(mySpy).toHaveBeenCalled();
        });
    });

    describe('error', () => {

        let redisWrapper;

        beforeEach(async () => {
            const Redis = require('ioredis');
            spyOnProperty(Redis, 'Cluster', 'get').and.callFake(() => {
                return MockIOErrorRedisCluster;
            });

            redisWrapper = await import(redisWrapperPath);
            redisWrapper.setupRedis({});
            // we don't want something running
            if (redisWrapper.getRedisHandle().redisClient.disconnect) {
                redisWrapper.getRedisHandle().redisClient.disconnect();
            }
            const mock = new MockIOErrorRedisCluster(nodesData, redisOptions);
            redisWrapper.getRedisHandle().redisClient = mock;
        });

        it('redisWrapper call fetch and expect error', async () => {
            const results = await redisWrapper.fetch('1234', '12312312');
            expect(results).toBeUndefined();
        });

        it('redisWrapper call setItem and expect error', async () => {

            const mySpy = spyOn(redisWrapper, 'setItem');
            mySpy('1234', {
                'hashKey': '12312312',
                'html': '<html><doc goes here</html>',
                'compressed': false,
                'createTime': new Date().getTime(),
                'buildNumber': 'BUFE-node.js',
                'gitBranch': 'Unknown-Local'
            });
            expect(mySpy).toHaveBeenCalled();

        });

        it('redisWrapper call setCacheExpirationTime', async () => {

            const mySpy = spyOn(redisWrapper, 'setCacheExpirationTime').and.callThrough();
            await mySpy('1234', 2 * 3600 * 1000);
            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call dbsize', async () => {

            const mySpy = spyOn(redisWrapper, 'getDbsize').and.callThrough();
            await mySpy('1234', 2 * 3600 * 1000);
            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call flushAll', async () => {

            const mySpy = spyOn(redisWrapper, 'flushAll').and.callThrough();
            await mySpy();
            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call getAllKeys', async () => {

            const mySpy = spyOn(redisWrapper, 'getAllKeys').and.callThrough();
            await mySpy();
            expect(mySpy).toHaveBeenCalled();
        });

        it('redisWrapper call deleteItem', async () => {

            const mySpy = spyOn(redisWrapper, 'deleteItem').and.callThrough();
            await mySpy('/templateResolver?*');
            expect(mySpy).toHaveBeenCalled();
        });
    });
});
