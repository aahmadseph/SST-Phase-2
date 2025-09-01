describe('seoUtils', () => {

    let getSeoURL;
    beforeEach(async() => {
        const res = await import('#server/services/utils/seoUtils.mjs');
        getSeoURL = res.getSeoURL;
    });

    it('getSeoURL targetScreen category', () => {

        const results = {
            targetScreen: 'category',
            targetUrl: '/v1/somewhereelse',
            'targetValue': 'cat60049;countryCode=US',
            'template': 1
        };

        const seoNameIn = '/shop/lipstick';

        const res = getSeoURL(seoNameIn, results);
        expect(res.statusCode).toEqual(301);
    });

    it('getSeoURL targetScreen product', () => {

        const results = {
            targetScreen: 'product',
            targetUrl: '/v1/somewhereelse',
            'targetValue': 'P381000;skuId=1789635;countryCode=US'
        };

        const seoNameIn = '/product/P381000';

        const res = getSeoURL(seoNameIn, results);
        expect(res.statusCode).toEqual(301);
    });

    it('getSeoURL targetScreen brandList', () => {

        const results = {
            targetScreen: 'brandList',
            targetUrl: '/v1/somewhereelse'
        };

        const seoNameIn = '/brand-list';

        const res = getSeoURL(seoNameIn, results);
        expect(res.statusCode).toEqual(302);
    });

    it('getSeoURL type Unified Content Store', () => {

        const results = {
            targetScreen: 'Unified Content Store',
            type: 'Unified Content Store',
            pageType: 2,
            targetUrl: 'somewhereelse'
        };

        const seoNameIn = '/beauty/fashion-lipstick';

        const res = getSeoURL(seoNameIn, results);
        expect(res.statusCode).toEqual(302);
    });

    it('getSeoURL type Unified Content Store pageType 3', () => {

        const results = {
            targetScreen: 'Unified Content Store',
            type: 'Unified Content Store',
            pageType: 3,
            targetUrl: 'somewhereelse',
            targetValue: '123567;catspash'
        };

        const seoNameIn = '/beauty/fashion-lipstick';

        const res = getSeoURL(seoNameIn, results);
        expect(res.mediaId).toBeUndefined();
    });

    it('getSeoURL type Unified Content Store pageType 1', () => {

        const results = {
            targetScreen: 'Unified Content Store',
            type: 'Unified Content Store',
            pageType: 1,
            targetUrl: 'somewhereelse',
            targetValue: '123567;catspash'
        };

        const seoNameIn = '/beauty/fashion-lipstick';

        const res = getSeoURL(seoNameIn, results);
        expect(res.statusCode).toEqual(301);
    });

    it('getSeoURL type ufeBrand', () => {

        const results = {
            targetScreen: 'ufeBrand',
            type: 'ufeBrand',
            targetUrl: '/v1/somewhereelse',
            targetValue: 'fenty'
        };

        const seoNameIn = '/brand/fenty';

        const res = getSeoURL(seoNameIn, results);
        expect(res.statusCode).toEqual(301);
    });
});
