describe('SimpleCache', () => {

    const data = 'some data to be stored in a map';

    let SHORT_CACHE,
        CACHE_FOUR_HOURS,
        simpleCache;

    beforeEach(async() => {

        const resc = await import('#server/services/utils/cacheTimes.mjs');
        SHORT_CACHE = resc.SHORT_CACHE;
        CACHE_FOUR_HOURS = resc.CACHE_FOUR_HOURS;

        const ress = await import('#server/services/utils/SimpleCache.mjs');
        const SimpleCache = ress.default;
        simpleCache = new SimpleCache();
    });

    it('SimpleCache setCache', () => {

        simpleCache.setCache('bob', data, CACHE_FOUR_HOURS);

        expect(simpleCache.cache.get('bob').data).toEqual(data);
    });

    it('SimpleCache purge', () => {

        simpleCache.maxCacheItems = 2;

        spyOn(simpleCache, 'purge');

        simpleCache.setCache('bob', data, SHORT_CACHE);
        simpleCache.setCache('barb', data, SHORT_CACHE);
        simpleCache.setCache('fish', data, SHORT_CACHE);

        expect(simpleCache.purge).toHaveBeenCalled();
    });


    it('SimpleCache getCache', () => {

        simpleCache.setCache('bob', data, SHORT_CACHE);

        expect(simpleCache.getCache('bob')).toEqual(data);
    });

    it('SimpleCache getCache stale', (done) => {

        simpleCache.setCache('xbox', data, 1);
        setTimeout(() => {
            expect(simpleCache.getCache('xbox')).toBeUndefined();
            done();
        }, 100);
    });

    it('SimpleCache size', () => {

        simpleCache.setCache('bob', data, SHORT_CACHE);

        simpleCache.setCache('xbox', data, SHORT_CACHE);

        expect(simpleCache.size()).toEqual(2);
    });

    it('SimpleCache purge', () => {

        simpleCache.setCache('bob', data, SHORT_CACHE);

        simpleCache.setCache('xbox', data, SHORT_CACHE);

        simpleCache.purge();

        expect(simpleCache.size()).toEqual(0);
    });

    it('SimpleCache purge with numberOfCachePurges = 1 ', () => {

        simpleCache.setCache('bob', data, SHORT_CACHE);

        simpleCache.setCache('xbox', data, SHORT_CACHE);

        simpleCache.purgeCount = 1;
        simpleCache.purge();

        expect(simpleCache.numberOfCachePurges).toEqual(1);
    });

    it('SimpleCache purge with long caches = 1 ', () => {

        for (let i = 0, end = simpleCache.maxCacheItems + 5; i < end; i++) {
            const key = `bob_${i}`;
            simpleCache.setCache(key, data, CACHE_FOUR_HOURS);
        }

        expect(simpleCache.numberOfCachePurges).toBeGreaterThan(0);
    });

    it('SimpleCache test partialKeysToList should equal 3', () => {

        const longList = 'p1234:us,p5672:us,p4432:ca';

        const results = simpleCache.partialKeysToList(longList);

        expect(results.length).toEqual(3);

    });

    it('SimpleCache test partialKeysToList should equal 1', () => {

        const longList = undefined;

        const results = simpleCache.partialKeysToList(longList);

        expect(results.length).toEqual(0);

    });

    it('SimpleCache test partialKeysToList should equal 3 no country', () => {

        const longList = 'p1234,p5672:,p4432:ca';

        const results = simpleCache.partialKeysToList(longList);

        expect(results.length).toEqual(3);

    });

    it('SimpleCache test getFilteredKeys should equal 1', () => {

        const longList = 'p1234:us,p5672:us,p4432:ca';

        simpleCache.setCache('product-stuff-p1234?channel=us', data, CACHE_FOUR_HOURS);

        const keyList = simpleCache.partialKeysToList(longList);
        const results = simpleCache.getFilteredKeys(keyList);

        expect(results.length).toEqual(1);

    });

    it('SimpleCache test getFilteredKeys should equal 0', () => {

        const longList = 'p1234:us,p5672:us,p4432:ca';

        simpleCache.setCache('product-stuff-p12434?channel=us', data, CACHE_FOUR_HOURS);

        const keyList = simpleCache.partialKeysToList(longList);
        const results = simpleCache.getFilteredKeys(keyList);

        expect(results.length).toEqual(0);

    });

    it('SimpleCache test getFilteredKeys should equal 0 when undefined list passed in', () => {

        const longList = undefined;

        simpleCache.setCache('product-stuff-p12434?channel=us', data, CACHE_FOUR_HOURS);

        const keyList = simpleCache.partialKeysToList(longList);
        const results = simpleCache.getFilteredKeys(keyList);

        expect(results.length).toEqual(0);

    });
});
