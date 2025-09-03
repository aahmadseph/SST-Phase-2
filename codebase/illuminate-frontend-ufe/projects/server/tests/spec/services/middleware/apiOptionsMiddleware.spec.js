/* eslint class-methods-use-this: 0, indent: 0 */
describe('apiOptionsMiddleware', () => {

    const Writable = require('stream').Writable;

    let apiOptionsMiddleware;

    beforeEach((done) => {
        import('#server/services/middleware/apiOptionsMiddleware.mjs')
            .then(res => {
                apiOptionsMiddleware = res.default;
                done();
            });
    });

    class responseMockClass extends Writable {
        setHeader() {}
        _write(chunk, encoding, callback) {
            return callback();
        }
        writeHead() {}
        end() {}
        on(whatEvt, cb) {
            cb('something');
        }
    }

    class requestMock extends Writable {

        constructor(host, options, cb) {
            super();
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
        end() {
            this.cb(new responseMockClass());
        }
    }

    it('call apiOptionsMiddleware', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        function next() {
            expect(request.apiOptions).toBeDefined();
        }

        apiOptionsMiddleware(request, response, next);

    });

    it('call apiOptionsMiddleware with pagedata', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.url = '/api/pagedata' + request.url;

        function next() {
            expect(request.apiOptions).toBeDefined();
        }

        apiOptionsMiddleware(request, response, next);

    });

    it('call apiOptionsMiddleware with pagedata no query params', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.url = '/api/pagedata' + request.path;
        request.query = undefined;
        request.parseQuery = undefined;

        function next() {
            expect(request.apiOptions).toBeDefined();
        }

        apiOptionsMiddleware(request, response, next);

    });

    it('call apiOptionsMiddleware with product URL that has escaped pipe in it', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.path = '/product/cream-lip-stain-liquid-lipstick-P281411%7C';
        request.query = undefined;
        request.parseQuery = undefined;

        function next() {
            expect(request.apiOptions.apiPath).toEqual('/product/cream-lip-stain-liquid-lipstick-P281411%7C');
        }

        apiOptionsMiddleware(request, response, next);

    });

    it('call apiOptionsMiddleware with product URL that has unescaped pipe in it', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        request.path = '/product/cream-lip-stain-liquid-lipstick-P281411|';
        request.query = undefined;
        request.parseQuery = undefined;

        function next() {
            expect(request.apiOptions.apiPath).toEqual('/product/cream-lip-stain-liquid-lipstick-P281411%7C');
        }

        apiOptionsMiddleware(request, response, next);

    });
});
