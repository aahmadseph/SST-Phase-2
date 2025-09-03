describe('memCacheFlush.js', () => {

    process.env.LOG_LEVEL = 'warn';
    process.env.ENABLE_REDIS = false;

    const baseDir = process.cwd();

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    let flushMemoryCache,
        CACHE_MANAGER_USERNAME,
        CACHE_MANAGER_PASSWORD;

    beforeEach(async () => {
        const res = await import('#server/services/routing/memCacheFlush.mjs');
        flushMemoryCache = res.flushMemoryCache;

        const res2 = await import('#server/config/envRouterConfig.mjs');
        CACHE_MANAGER_USERNAME = res2.CACHE_MANAGER_USERNAME;
        CACHE_MANAGER_PASSWORD = res2.CACHE_MANAGER_PASSWORD;
    });

    it('memCacheFlush testing no data', (done) => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.method = 'POST';

        process.send = () => {};

        spyOn(response, 'writeHead').and.callFake((statusCode, data) => {
            expect(statusCode).toEqual(403);
            done();
        });

        flushMemoryCache(request, response);
    });

    it('memCacheFlush testing data but no usrnm', (done) => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.method = 'POST';
        request.bodyBuffers = [Buffer.from('username=bob')];
        process.send = () => {};

        spyOn(response, 'writeHead').and.callFake((statusCode, data) => {
            expect(statusCode).toEqual(403);
            done();
        });

        flushMemoryCache(request, response);
    });

    it('memCacheFlush testing data with usrnm', (done) => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.method = 'POST';
        request.bodyBuffers = [Buffer.from(`usrnm=${CACHE_MANAGER_USERNAME}&psswrd=${CACHE_MANAGER_PASSWORD}`)];
        process.send = () => {};

        spyOn(response, 'writeHead').and.callFake((statusCode, data) => {
            expect(statusCode).toEqual(200);
            done();
        });

        flushMemoryCache(request, response);
    });
});
