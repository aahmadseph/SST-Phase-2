/* eslint class-methods-use-this: 0 */
const Duplex = require('stream').Duplex;
const StringDecoder = require('string_decoder').StringDecoder;

const decoder = new StringDecoder('utf8');

class DuplexStream extends Duplex {

    // setup dev null stream to fix the EPIPE error we were seeing in the client
    constructor(opts = {}) {
        super(opts);
        this.objectMode = true;

        this.index = 0;
        this.streamData = [];
        this.currentLength = 0;

        this.opts = opts;
        this.chunkSize = opts.chunkSize || 65536;
        this.encoding = opts.encoding || 'utf8';
        this.maxRequestSize = opts.maxRequestSize || 2e6;
        this.headers = opts.headers || {};

        if (this.maxRequestSize <= 0) {
            throw new Error(`Invalid max request size ${this.maxRequestSize}`);
        }

        this.once('finish', () => {
            this._read();
            this.push(null);
        });
    }

    _write(chunk, encoding, callback) {
        this.streamData.push(chunk);
        this.currentLength += chunk.length;

        // allowing no max size, which is dangerous, but might be necessary when we
        // don't know how big we can allow, think ppage with SEO embedded content?
        if (this.currentLength > this.maxRequestSize) {
            this.emit('error', this.currentLength);
            this.streamData = [];
        }

        // node built in function
        return callback();
    }

    pushParts(streamData, readSize) {
        const parts = Math.ceil(streamData.length / readSize),
            endReadSize = readSize - 1;

        for (let i = 0; i < parts; i++) {
            const index = i * readSize;
            const chunk = streamData.slice(index, i + endReadSize);
            this.push(chunk);
        }
    }

    _read(size) {
        const readSize = size || this.chunkSize;

        while (this.index < this.streamData.length) {
            const streamData = this.streamData[this.index];

            if (streamData) {
                if (streamData.length <= readSize) {
                    this.push(streamData);
                } else {
                    this.pushParts(streamData, readSize);
                }
            }

            this.index++;
        }
    }

    toString() {
        return decoder.write(Buffer.concat(this.streamData, this.currentLength));
    }

    getBuffer() {
        return Buffer.concat(this.streamData, this.currentLength);
    }

    getBuffers() {
        return this.streamData;
    }

    getLength() {
        return this.currentLength;
    }
}

module.exports = class responseMockClass extends DuplexStream {
    constructor(options = {}) {
        super(options);
        this.statusCode = options.statusCode || 200;
        this.isEnd = false;
        this.isFinished = false;
        this.headers = {};
        this.raiseError = false;
    }
    setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
    }
    writeHead() {}
    end() {}
    json() {}
    getHeaders() {
        return this.headers;
    }
    cookie(name, value, options = {}) {
        this.headers['set-cookie'] = `${name}=${value}${options.expires ? ';expires=' + options.expires: ''}`;
    }
    on(whatEvt, cb) {
        /* force these in order */
        if (whatEvt === 'finish') {
            this.isFinished = true;
            setTimeout(() => {
                cb();
            }, 2000);
        } else if (whatEvt === 'end') {
            this.end = true;
            setTimeout(() => {
                cb();
            }, 1000);
        } else if (whatEvt === 'unpipe') {
            cb('data data data');
        } else if (whatEvt === 'close') {
            cb('data data data');
        } else if (whatEvt === 'error') {
            if (this.raiseError) {
                throw new Error('fudge');
            } else {
                cb('data data data');
            }
        } else {
            cb('data data data');
        }
    }
};
