/* eslint class-methods-use-this: 0, indent: 0  */
describe('bodySaverMiddleware', () => {

    const Writable = require('stream').Writable;
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

    let bodySaver,
        getBodySaverMetrics,
        requestMock;

    beforeEach(async() => {
        const { DuplexStream } = await import('#server/libs/DuplexStream.mjs');

        const res = await import('#server/services/middleware/bodySaverMiddleware.mjs');
        bodySaver = res.bodySaver;
        getBodySaverMetrics = res.getBodySaverMetrics;

        class requestMockClass extends DuplexStream {

            constructor(host, options, cb) {
                super();
                this.path = '/api/profile/registration';
                this.method = 'POST';
                this.url = this.path;
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
        requestMock = requestMockClass;
    });

    it('call bodySaverMiddleware', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        function next() {
            expect(request.apiOptions.country).toBeDefined();
        }

        bodySaver(request, response, next);
    });

    it('call getBodySaverMetrics', () => {

        const request = new requestMock(),
            response = new responseMockClass();

        function next() {
            const metrics = getBodySaverMetrics();
            expect(metrics.maxSaveTime).toBeGreaterThan(0);
        }

        bodySaver(request, response, next);
    });
});
