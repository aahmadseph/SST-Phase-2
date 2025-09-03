/* eslint class-methods-use-this: 0, indent: 0  */
describe('timingMiddleware', () => {

    const Writable = require('stream').Writable;

    const baseDir = process.cwd();
    let timingMiddleware,
        getRequestMetrics;

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMockClass = require('#tests/mocks/requestMock.js');

    beforeEach((done) => {
        import('#server/services/middleware/timingMiddleware.mjs')
        .then(res => {
            timingMiddleware = res.timingMiddleware;
            getRequestMetrics = res.getRequestMetrics;
            done();
        });
    });

    class requestMock extends requestMockClass {

        constructor(host, options, cb) {
            super(options, cb);
            this.path = '/product/bite-beauty-power-move-creamy-matte-lip-crayon-vegan-P454746';
            this.query = 'skuid=1234';
            this.url = `${this.path}?${this.query}`;
            this.headers = {
                cookie: 'current_country=US; site_locale=us; device_type=desktop; site_language=en; ',
                path: this.url
            };
            this.cookies = {
                'current_country': 'US',
                'site_locale': 'us',
                'device_type': 'desktop',
                'site_language': 'en'
            };
            this.host = host;
            this.options = options;
            this.cb = cb;
        }
    }

    it('call timingMiddleware', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        function next() {
            response.end();
            expect(request.headers['request-start-time']).toBeDefined();
        }

        timingMiddleware(request, response, next);

    });

    it('call timingMiddleware contentType', () => {

        const request = new requestMock(),
            response = new responseMockClass();
        response.setHeader('content-type', 'text/html');

        function next() {
            response.end();
            expect(request.headers['request-start-time']).toBeDefined();
        }

        timingMiddleware(request, response, next);

    });

    it('call getRequestMetrics', () => {
        const results = getRequestMetrics();
        expect(results.requestCounts).toBeDefined();
    });

    it('call getRequestMetrics again', () => {
        const results = getRequestMetrics();
        expect(results.metricCounts).toBeDefined();
    });
});
