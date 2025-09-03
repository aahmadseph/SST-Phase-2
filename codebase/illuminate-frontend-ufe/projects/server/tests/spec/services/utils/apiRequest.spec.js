/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('apiRequest', () => {

    const baseDir = process.cwd();

    const url = '/v1/catalog/false',
        headers = { cookie: '' },
        options = {
            channel: 'MW',
            language: 'en',
            country: 'US',
            headers: {
                Cookie: [],
                'cookies-as-string': '',
                'request-id': 'abc-123'
            }
        },
        dedupableOptions = {
            channel: 'MW',
            language: 'en',
            country: 'US',
            dedupable: true,
            headers: {
                Cookie: [],
                'cookies-as-string': '',
                'request-id': 'abc-123'
            }
        };

    let apiRequest;
    beforeAll(async() => {
        apiRequest = await import('#server/services/utils/apiRequest.mjs');
    });

    it('ufeGet request', (done) => {

        apiRequest.ufeGet(url, headers, options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });

    it('ufeGet request dedupable', (done) => {

        apiRequest.ufeGet(url, headers, dedupableOptions)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });

    it('apiGet request', (done) => {

        apiRequest.apiGet(url, headers, options)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });

    it('apiGet request dedupable', (done) => {

        apiRequest.apiGet(url, headers, dedupableOptions)
            .then(data => {
                expect(data).toBeDefined();
                done();
            }).catch(e => {
                done();
            });
    });
});
