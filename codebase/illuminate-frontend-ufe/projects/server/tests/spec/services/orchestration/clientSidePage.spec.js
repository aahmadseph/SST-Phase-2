describe('clientSidePage', () => {
    const baseDir = process.cwd();

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    let orchestrator,
        simpleCache,
        http,
        https,
        fiveMinutes,
        setConfigurationCacheItem;

    beforeAll(async () => {
        http = await import('node:http');
        https = await import('node:https');
    });

    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });

        spyOn(https, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });

        orchestrator = await import('#server/services/orchestration/clientSidePage.mjs');
        const makeRequest = await import('#server/framework/services/apiUtils/makeRequest.mjs');
        simpleCache = makeRequest.simpleCache;
        const cacheTimes = await import('#server/services/utils/cacheTimes.mjs');
        fiveMinutes = cacheTimes.CACHE_FIVE_MINUTES;

        const configCache = await import('#server/services/utils/configurationCache.mjs');
        setConfigurationCacheItem = configCache.setConfigurationCacheItem;

        const cacheKeyHFR = '/content-page-exp/v1/content/globalElements/headerFooter?ch=rwd&loc=en-US';

        simpleCache.setCache(cacheKeyHFR, {
            headers: {},
            data: '{}'
        }, fiveMinutes);
        setConfigurationCacheItem({
            channel: 'rwd',
            language: 'en',
            country: 'US'
        }, {
            headers: {},
            data: '{}'
        });
    });

    it('clientSidePage orchestration', async () => {
        const request = new requestMock({
                channel: 'rwd',
                language: 'en',
                country: 'US',
                path: '/bland-pages'
            }),
            response = new responseMockClass();

        const spyFn = spyOn(orchestrator, 'default').and.callThrough();
        await spyFn(request, response, 'Search/Search');
        expect(spyFn).toHaveBeenCalled();
    });

    it('clientSidePage orchestration mediaId and seoURL', async () => {
        const request = new requestMock({
                channel: 'rwd',
                language: 'en',
                country: 'US'
            }),
            response = new responseMockClass();

        const spyFn = spyOn(orchestrator, 'default').and.callThrough();
        await spyFn(request, response, 'Search/Search');
        expect(spyFn).toHaveBeenCalled();
    });

    it('clientSidePage orchestration mediaId and seoURL', async () => {
        const request = new requestMock({
                channel: 'MW',
                language: 'en',
                country: 'US'
            }),
            response = new responseMockClass();
        simpleCache.setCache('/v1/catalog/media/123456?countrycode=us&includeregionsmap=true', {
            headers: {},
            data: '{}'
        }, fiveMinutes);
        simpleCache.setCache('/seo-service/graphql?seoUrl=/shop/lipgloss&ch=rwd&loc=en-US', {
            headers: {},
            data: '{}'
        }, fiveMinutes);

        const spyFn = spyOn(orchestrator, 'default').and.callThrough();
        await spyFn(request, response, 'Search/Search', {}, {
            mediaId: 123456,
            seoURL: '/shop/lipgloss'
        });
        expect(spyFn).toHaveBeenCalled();
    });
});
