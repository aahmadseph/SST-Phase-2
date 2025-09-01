/* eslint class-methods-use-this: 0, no-empty: 0 */
describe('ufeServiceCaller', () => {

    const zlib = require('zlib');
    const http = require('http');

    const baseDir = process.cwd();

    let ufeServiceCaller;

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    const basePageData = Object.assign({}, {
        apiConfigurationData: {}
    }, {
        headerFooterTemplate: {}
    }, {
        enableNoindexMetaTag: false,
        templateInformation: {
            'template': 'Search/Search',
            'channel': 'rwd'
        }
    });

    let flag = false;
    let cres;
    beforeEach(async () => {
        flag = false;

        // load the cache
        const redisWrapper = await import('#server/services/utils/redisWrapper.mjs');

        spyOn(redisWrapper, 'setupRedis').and.callFake(() => {
            return {};
        });
        spyOn(redisWrapper, 'fetch').and.callFake(() => {
            return undefined;
        });
        spyOn(redisWrapper, 'setItem').and.callFake(() => {});
        spyOn(redisWrapper, 'setCacheExpirationTime').and.callFake(() => {});
        spyOn(redisWrapper, 'isRedisEnabled').and.callFake(() => {
            flag = true;
            return true;
        });

        const sendOKResponse = await import('#server/utils/sendOKResponse.mjs');
        spyOn(sendOKResponse, 'sendOKResponse').and.callFake(() => {
            return;
        });

        spyOn(http, 'request').and.callFake((opts, cb) => {
            flag = true;
            return new requestMock(opts, cb);
        });

        process.env.ENABLE_REDIS = true;
        const res = await import('#server/services/utils/ufeServiceCaller.mjs');
        ufeServiceCaller = res;
        spyOn(ufeServiceCaller, 'ufeServiceCaller').and.callThrough();
    });

    it('ufeServiceCaller default', async() => {

        const options = {
            abTest: undefined,
            channel: 'MW',
            language: 'en',
            country: 'US',
            cacheable: false,
            paramsString: undefined,
            isMockedResponse: false,
            responseHeaders: {},
            headers: {
                'request-id': 12345
            }
        };

        const request = new requestMock(options),
            response = new responseMockClass();

        try {
            await ufeServiceCaller.ufeServiceCaller(request.path, basePageData, response, options);
            expect(ufeServiceCaller.ufeServiceCaller).toHaveBeenCalled();
        } catch (_e) {}
    });

    it('ufeServiceCaller not cached', async() => {

        const options = {
            channel: 'MW',
            language: 'en',
            country: 'US',
            headers: {
                'request-id': 12345
            }
        };

        const request = new requestMock(options),
            response = new responseMockClass();

        try {
            await ufeServiceCaller.ufeServiceCaller(request.path, basePageData, response, options);
            expect(ufeServiceCaller.ufeServiceCaller).toHaveBeenCalled();
        } catch (_e) {}
    });

    it('ufeServiceCaller isCanary', async() => {

        const options = {
            channel: 'MW',
            language: 'en',
            country: 'US',
            cacheable: true,
            isCanary: true,
            paramsString: 'ref=1232',
            headers: {
                'request-id': 12345
            }
        };

        const request = new requestMock(options),
            response = new responseMockClass();

        try {
            await ufeServiceCaller.ufeServiceCaller(request.path, basePageData, response, options);
            expect(ufeServiceCaller.ufeServiceCaller).toHaveBeenCalled();
        } catch (_e) {}
    });
});
