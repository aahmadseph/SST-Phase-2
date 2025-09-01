/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('getConfiguration', () => {

    const http = require('http');

    const baseDir = process.cwd();

    const requestMock = require('#tests/mocks/requestMock.js');

    const headers = { 'device_type': 'mobile' },
        options = {
            channel: 'MW',
            language: 'en',
            country: 'US'
        };

    let getConfiguration;
    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMock(opts, cb);
        });
        const res = await import('#server/services/api/util/getConfiguration.mjs');
        getConfiguration = res.default;
    });

    it('getConfiguration request', (done) => {

        getConfiguration(options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
