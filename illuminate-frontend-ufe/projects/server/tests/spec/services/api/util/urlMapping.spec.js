/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('urlMapping', () => {
    const http = require('http');

    const requestMock = require('#tests/mocks/requestMock.js');

    const pathname = '/shop/lipstick',
        options = {
            channel: 'MW',
            language: 'en',
            country: 'US',
            pathname: pathname
        };

    let urlMapping;
    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });

        const res = await import('#server/services/api/util/urlMapping.mjs');
        urlMapping = res.default;
    });

    it('urlMapping request', (done) => {

        urlMapping(options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
