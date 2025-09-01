/* eslint class-methods-use-this: 0 */
const Writable = require('stream').Writable;

const responseMockClass = require('#tests/mocks/responseMock.js');

module.exports = class RequestMock extends Writable {

    constructor(options = {}, cb) {
        super(options);
        this.path = options.path || '/v1/catalog/fake';
        this.url = options.url || this.path;
        this.parsedUrl = { path: this.path };
        this.headers = Object.assign({}, {
            'request-start-time': process.hrtime(),
            'request-id': 'abc-1234',
            'Cookie': []
        }, (options.headers || {}));
        this.cookies = options.cookies || {};
        this.query = options.query || {};
        this.host = 'localhost';
        this.options = options;
        this.apiOptions = Object.assign({}, options, { apiPath: this.path });
        this.cb = cb;
        this.response = options.response || new responseMockClass(options);

        if (!this.apiOptions.channel) {
            this.apiOptions.channel = 'RWD';
        }

        if (!this.apiOptions.jsessionid) {
            this.apiOptions.jsessionid = 'abc123';
        }

        if (!this.apiOptions.url) {
            this.apiOptions.url = this.path;
        }

        if (!this.apiOptions.headers) {
            this.apiOptions.headers = {
                'User-Agent': 'Mozilla',
                'host': 'localhost',
                'Accept': 'text/plain',
                //'referer': request.headers['referer'],
                'Accept-Encoding': '',
                'Accept-Language': 'en_us',
                // treat cookies as object and serialize later when we need it as string
                'Cookie': {},
                'cookies-as-string': '',
                'request-id': '123123123'
            };
        }
    }
    setSocketKeepAlive() {}
    setTimeout(timeout, cb) {
        setTimeout(cb, timeout);
    }
    write() {}
    end() {
        this.cb(this.response);
    }
};
