describe('getCacheKey', () => {

    let getCacheItem,
        SimpleCache;

    beforeEach(async() =>{
        process.env.ENABLE_REDIS = true;
        process.env.CACHE_ENABLED = true;
        const res = await import('#server/framework/services/apiUtils/getCacheKey.mjs?timestamp=1234');
        getCacheItem = res.getCacheItem;

        const xres = await import('#server/services/utils/SimpleCache.mjs');
        SimpleCache = xres.default;

    });

    afterEach(() =>{
        process.env.CACHE_ENABLED = false;
        process.env.ENABLE_REDIS = false;
    });

    it('no key', () => {

        const options = {
            channel: 'MW',
            country: 'US',
            language: 'en',
            cacheTime: 5000,
            jsessionid: 1234,
            isMockedResponse: false
        };

        const cache = new SimpleCache();

        const item = getCacheItem(options, '/shop/stuff', false, cache);
        expect(item).toBeUndefined();

    });

    it('stored key', () => {

        const options = {
            channel: 'MW',
            country: 'US',
            language: 'en',
            cacheTime: 5000,
            jsessionid: 1234,
            isMockedResponse: false,
            method: 'GET'
        };

        const key = '/shop/stuff';
        const cache = new SimpleCache();
        cache.setCache(key, 'some data is stored here', 1000 * 60 * 5);

        const item = getCacheItem(options, key, false, cache);
        expect(item).toBeDefined();
    });
});
