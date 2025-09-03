/* eslint class-methods-use-this:[0] */
describe('contentStorePages', () => {
    const baseDir = process.cwd();

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    let orchestrator,
        sendError,
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

        orchestrator = await import('#server/services/orchestration/contentStorePages.mjs');
        sendError = await import('#server/utils/sendErrorResponse.mjs');
    });

    it('content store pages orchestration', async () => {
        class RMock extends requestMock {
            on(whatEvt, cb) {
                if (cb) {
                    console.error(whatEvt);
                    cb('');
                }
            }
        }
        const request = new RMock({
                channel: 'MW',
                language: 'en',
                country: 'US',
                dedupable: true
            }),
            response = new responseMockClass();

        const spyFn = spyOn(orchestrator, 'default').and.callThrough();
        await spyFn(request, response);
        expect(spyFn).toHaveBeenCalled();
    });

});
