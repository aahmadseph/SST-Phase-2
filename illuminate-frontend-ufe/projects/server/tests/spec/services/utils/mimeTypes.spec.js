/* eslint class-methods-use-this: 0 */
describe('mimeType', () => {

    const Writable = require('stream').Writable;

    let mimeTypes;
    beforeEach(async() => {
        const res2 = await import('#server/services/utils/mimeTypes.mjs');
        mimeTypes = res2.default;
    });

    class responseMockClass extends Writable {
        constructor() {
            super();
            this.headers = {};
        }
        setHeader(name, value) {
            this.headers[name] = value;
        }
        _write(chunk, encoding, callback) {
            return callback();
        }
        writeHead() {}
        getHeader(header) {
            return this.headers[header];
        }
        end() {}
        on(whatEvt, cb) {
            cb('something');
        }
    }


    class requestMock extends Writable {
        constructor(host, options, cb) {
            super();
            this.path = '/img/something.svg';
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

    it('set content-type header', () => {
        const request = new requestMock(),
            response = new responseMockClass();

        mimeTypes(request, response);
        expect(response.getHeader('Content-Type')).toEqual('image/svg+xml');
    });
});
