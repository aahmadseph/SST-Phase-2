/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('getCategory', () => {

    const http = require('http');

    const requestMock = require('#tests/mocks/requestMock.js');

    const headers = { 'device_type': 'mobile' },
        options = {
            channel: 'FS',
            language: 'en',
            country: 'US',
            seoBrandUrl: '/shop/fenty'
        };

    let getCategory;
    beforeEach(async() => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });
        const res = await import('#server/services/api/catalog/categories/getCategory.mjs');
        getCategory = res.default;
    });

    it('getCategory request', (done) => {

        getCategory(options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
