/* eslint class-methods-use-this: 0, indent: 0  */
describe('cspMiddleware', () => {

    let cspMiddleware;

    class responseMockClass {
        set() {}
    }

    beforeEach((done) => {
        import('#server/services/middleware/cspMiddleware.mjs')
        .then(res => {
            cspMiddleware = res.default;
            done();
        });
    });

    it('call cpsMiddleware', () => {

        const response = new responseMockClass(),
            setSpy = spyOn(response, 'set');

        function next() {
            // eslint-disable-next-line
            expect(setSpy).toHaveBeenCalledWith(`Content-Security-Policy`, `frame-ancestors 'none'`);
        }

        cspMiddleware({ path: '/' }, response, next);

    });
});
