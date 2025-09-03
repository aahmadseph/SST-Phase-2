/* eslint class-methods-use-this: 0, indent: 0  */
describe('requestIDMiddleware', () => {

    const baseDir = process.cwd();
    let requestIDMiddleware;

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMockClass = require('#tests/mocks/requestMock.js');

    beforeEach((done) => {
        import('#server/services/middleware/requestIDMiddleware.mjs')
        .then(res => {
            requestIDMiddleware = res.default;
            done();
        });
    });

    it('call requestIDMiddleware', () => {

        const request = new requestMockClass(),
            response = new responseMockClass();

        function next() {
            response.end();
            expect(request.headers['request-id']).toBeDefined();
        }

        requestIDMiddleware(request, response, next);

    });

    it('check that there are at least 3 parts in request-id', () => {

        const request = new requestMockClass(),
            response = new responseMockClass();

        function next() {
            response.end();
            const requestID = request.headers['request-id'].split('-');
            expect(requestID.length).toBeGreaterThan(2);
        }

        requestIDMiddleware(request, response, next);

    });

    it('call requestIDMiddleware', () => {

        const request = new requestMockClass(),
            response = new responseMockClass();

        function next() {
            response.end();
            const requestID = request.headers['request-id'].split('-');
            const mpid = process.pid;
            expect(Number(requestID[0])).toEqual(Number(mpid));
        }

        requestIDMiddleware(request, response, next);

    });
});
