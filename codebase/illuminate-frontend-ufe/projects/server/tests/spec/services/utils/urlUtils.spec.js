describe('urlUtils', () => {
    const requestMock = require('#tests/mocks/requestMock.js');

    const headers = {
        'Accept': 'application/json;charset=UTF-8',
        'Accept-Language': 'en-US,en-AU;q=0.9,en;q=0.8',
        'Content-Type': 'application/json'
    };

    let urlUtils,
        shouldRedirect,
        filterParams,
        cookiesToString;
    beforeEach(async() => {

        const res = await import('#server/services/utils/urlUtils.mjs');
        urlUtils = res;
        shouldRedirect = res.shouldRedirect;
        filterParams = res.filterParams;
        cookiesToString = res.cookiesToString;
    });

    it('shouldRedirect error', () => {

        const data = {};

        const redirect = shouldRedirect(data).newLoc;

        expect(redirect).toBeUndefined();
    });

    it('shouldRedirect no data in', () => {

        const redirect = shouldRedirect().newLoc;

        expect(redirect).toBeUndefined();
    });

    it('shouldRedirect true', () => {

        const data = { targetUrl: '/shop/lipstick' };

        const redirect = shouldRedirect({ data: JSON.stringify(data) }).newLoc;

        expect(redirect).toEqual(data.targetUrl);
    });

    it('shouldRedirect true with headers', () => {

        const data = { targetUrl: '/shop/lipstick' };

        const redirect = shouldRedirect({
            headers: headers,
            data: JSON.stringify(data)
        }).newLoc;

        expect(redirect).toEqual(data.targetUrl);
    });

    it('shouldRedirect true with headers ', () => {

        const data = {
            targetUrl: '/shop/lipstick',
            redirectType: 302
        };

        const redirect = shouldRedirect({
            headers: headers,
            data: JSON.stringify(data)
        }).redirectType;

        expect(redirect).toEqual(data.redirectType);
    });

    it('shouldRedirect false', () => {

        const data = {};

        const redirect = shouldRedirect(JSON.stringify(data)).newLoc;

        expect(redirect).toBeUndefined();
    });

    it('filterParams none', () => {

        const pageSize = filterParams();
        expect(pageSize).toEqual('');
    });

    it('filterParams empty', () => {

        const pageSize = filterParams({});
        expect(pageSize).toEqual('');
    });

    it('filterParams pageSize', () => {

        const pageSize = filterParams({ pageSize: 4 });
        expect(pageSize).toBeDefined();
    });

    it('filterParams multiple params', () => {

        const pageSize = filterParams({
            pageSize: 4,
            pizza: 'yumm',
            ref: 12345
        });
        expect(pageSize).toBeDefined();
    });

    it('filterParams bad params', () => {

        const pageSize = filterParams({
            pizza: 'yumm',
            xref: 12345
        });
        expect(pageSize).toBeDefined();
    });

    // it('mapApiResponseToApiOptions no apiResponseHeaders', () => {
    //     const request = new requestMock();
    //     spyOn(urlUtils, 'mapApiResponseToApiOptions').and.callThrough();
    //     urlUtils.mapApiResponseToApiOptions(request, undefined);
    //     expect(urlUtils.mapApiResponseToApiOptions).toHaveBeenCalled();
    // });

    // it('mapApiResponseToApiOptions empty apiResponseHeaders object', () => {
    //     const request = new requestMock();
    //     const apiResponseHeaders = {};
    //     spyOn(urlUtils, 'mapApiResponseToApiOptions').and.callThrough();
    //     urlUtils.mapApiResponseToApiOptions(request, apiResponseHeaders);
    //     expect(urlUtils.mapApiResponseToApiOptions).toHaveBeenCalled();
    // });

    it('mapApiResponseToApiOptions apiResponseHeaders empty set cookie array', () => {
        const request = new requestMock();
        const apiResponseHeaders = { 'Set-Cookie': [] };
        const apiOptions = { headers: '' };
        urlUtils.mapApiResponseToApiOptions(request, apiResponseHeaders, apiOptions);
        expect(apiOptions.headers).toBeDefined();
    });

    it('mapApiResponseToApiOptions apiResponseHeaders empty set cookie array', () => {
        const request = new requestMock();
        const apiResponseHeaders = { 'set-cookie': [] };
        const apiOptions = { headers: '' };
        urlUtils.mapApiResponseToApiOptions(request, apiResponseHeaders, apiOptions);
        expect(apiOptions.headers).toBeDefined();
    });

    it('cookiesToString no cookies', () => {
        let cookies;
        const results = cookiesToString(cookies, '');
        expect(results).toEqual('');
    });

    it('cookiesToString empty cookie object', () => {
        const cookies = {};
        const results = cookiesToString(cookies, '');
        expect(results).toEqual('');
    });

    it('cookiesToString cookies already string', () => {
        const cookies = {
            'device_type': 'mobile',
            'site_locale': 'us',
            'site_language': 'en'
        };
        const cookiesAsAsString = 'device_type=mobile; site_locale=us; site_language=en';
        const results = cookiesToString(cookies);
        expect(results).toEqual(cookiesAsAsString);
    });

    describe('filter params upper funnel', () => {
        it('should remove ref param when only upper funnel refinements are passed in the url', () => {
            const filters = filterParams({
                ref: 'filters[Pickup]=1,filters[SameDay]=2,filters[ShipToHome]=3'
            });

            expect(filters).toEqual('');
        });

        it('should return only non upper funnel refinements', () => {
            const filters = filterParams({
                ref: 'filters[SameDay]=1,filters[Benefits]=Waterproof'
            });

            expect(filters).toBe(('ref=filters%5BBenefits%5D%3DWaterproof'));
        });
    });
});
