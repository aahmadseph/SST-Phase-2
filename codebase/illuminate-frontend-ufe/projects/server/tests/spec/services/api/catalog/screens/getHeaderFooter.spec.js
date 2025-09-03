/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('getHeaderFooter', () => {

    const http = require('http');

    const requestMock = require('#tests/mocks/requestMock.js');

    const options = {
        channel: 'FS',
        language: 'en',
        country: 'US',
        seoBrandUrl: '/shop/fenty'
    };

    let getHeaderFooter;
    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });
        const res = await import('#server/services/api/catalog/screens/getHeaderFooter.mjs');
        getHeaderFooter = res.default;
    });

    it('getHeaderFooter request', (done) => {

        getHeaderFooter(options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
