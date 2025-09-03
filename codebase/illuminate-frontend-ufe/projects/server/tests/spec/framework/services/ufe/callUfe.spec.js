/* eslint class-methods-use-this: 0 */
describe('callUfe', () => {

    const http = require('http');

    const requestMock = require('#tests/mocks/requestMock.js');

    process.env.COMPRESS_POST_DATA_TO_UFE = false;
    let callUfe;
    beforeAll(async() => {
        spyOn(http, 'request').and.callFake((options, cb) => {
            return new requestMock(options, cb);
        });
        const res = await import('#server/framework/services/ufe/callUfe.mjs');
        callUfe = res.callUfe;
    });

    it('basic callUfe', (done) => {

        const data = JSON.stringify({ 'templateName': 'ProductPage/ProductPage' });

        callUfe({
            channel: 'MW',
            country: 'US',
            language: 'en',
            cacheTime: 5000
        }, data).then(results => {
            expect(results).toBeDefined();
            done();
        }).catch(e => {
            console.error(e);
        });
    });
});
