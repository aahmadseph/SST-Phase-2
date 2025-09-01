/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('getProductDetails', () => {

    const http = require('http');


    const requestMock = require('#tests/mocks/requestMock.js');

    const headers = { 'device_type': 'mobile' },
        options = {
            channel: 'FS',
            language: 'en',
            country: 'US',
            seoBrandUrl: '/shop/fenty'
        };

    let getProductDetails;
    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });
        const res = await import('#server/services/api/catalog/products/getProductDetails.mjs');
        getProductDetails = res.default;
    });

    it('getProductDetails request', (done) => {

        getProductDetails(options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
