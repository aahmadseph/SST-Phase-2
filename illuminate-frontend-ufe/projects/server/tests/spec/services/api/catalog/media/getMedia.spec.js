/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('getMedia', () => {

    const http = require('http');


    const requestMock = require('#tests/mocks/requestMock.js');

    const options = {
        channel: 'FS',
        language: 'en',
        country: 'US',
        seoBrandUrl: '/shop/fenty'
    };

    let getMedia;
    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });
        const res = await import('#server/services/api/catalog/media/getMedia.mjs');
        getMedia = res.default;
    });

    it('getCategory request', (done) => {

        getMedia(options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
