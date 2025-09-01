/* eslint class-methods-use-this:[0] */
describe('productPages', () => {

    const baseDir = process.cwd();

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    class RMock extends requestMock {
        on(whatEvt, cb) {
            if (cb) {
                console.error(whatEvt);
                cb('');
            }
        }
    }

    let orchestrator,
        http,
        https;

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

        orchestrator = await import('#server/services/orchestration/productPages.mjs?timestamp=12345');
    });

    it('product page orchestration', async () => {
        const request = new RMock({
                channel: 'rwd',
                language: 'en',
                country: 'US',
                dedupable: true,
                path: '/product/sephora-collection-clean-charcoal-nose-strip-P461522'
            }),
            response = new responseMockClass();

        const spyFn = spyOn(orchestrator, 'default').and.callThrough();
        await spyFn(request, response);
        expect(spyFn).toHaveBeenCalled();
    });

});
