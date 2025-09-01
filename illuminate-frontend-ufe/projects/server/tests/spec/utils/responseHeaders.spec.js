/* eslint object-curly-newline: 0 */
describe('basic test of response headers getting', () => {
    const baseDir = process.cwd();

    let responseHeaders;

    beforeEach(async () => {
        const res = await import('#server/utils/responseHeaders.mjs?timesteamp=abcdef');
        responseHeaders = res.getResponseHeaders;
    });

    it('call responseHeaders with null', () => {

        const resultHeaders = responseHeaders();

        expect(resultHeaders).toBeDefined();
    });

    it('call responseHeaders with accept', () => {

        const resultHeaders = responseHeaders({
            'accept': 'text/html'
        });

        expect(resultHeaders['Content-Type']).toBeDefined();
    });

    it('call responseHeaders with accept json', () => {

        const resultHeaders = responseHeaders({
            'accept': 'application/json'
        });

        expect(resultHeaders['Content-Type']).toEqual('application/json; charset=UTF-8');
    });

    it('call responseHeaders with accept-encoding gzip', () => {

        const resultHeaders = responseHeaders({
            'accept-encoding': 'gzip'
        });

        expect(resultHeaders['Content-Encoding']).toEqual('gzip');
    });

    it('call responseHeaders with accept-encoding other', () => {

        const resultHeaders = responseHeaders({
            'accept-encoding': 'other'
        });

        expect(resultHeaders['Content-Encoding']).not.toBeDefined();
    });
});
