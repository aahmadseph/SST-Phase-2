import {
    StringDecoder
} from 'node:string_decoder';
import {
    Writable
} from 'node:stream';

import {
    MAX_REQUEST_SIZE
} from '#server/config/envConfig.mjs';

const BUFFER_ENCODING = 'utf8';

const decoder = new StringDecoder(BUFFER_ENCODING);

// this is our custom writeable stream implementation
// it stores data as buffers and lets you access the buffer or the string
// works well with the request object

class WritableStream extends Writable {

    #streamData = [];
    #currentLength = [];
    #maxRequestSize = MAX_REQUEST_SIZE;

    // setup dev null stream to fix the EPIPE error we were seeing in the client
    constructor(opts = {}) {
        super(opts);
        this.objectMode = opts.objectMode || true;
        this.#streamData = [];
        this.#currentLength = 0;
        this.#maxRequestSize = opts.maxRequestSize || MAX_REQUEST_SIZE;

        if (this.#maxRequestSize <= 0) {
            throw new Error(`Invalid max request size ${this.#maxRequestSize}`);
        }
    }

    #processChunk(chunk, _encoding) {
        this.#streamData.push(chunk);
        this.#currentLength += chunk.length;

        // allowing no max size, which is dangerous, but might be necessary when we
        // don't know how big we can allow like a page with SEO embedded content
        if (this.#currentLength > this.#maxRequestSize) {
            this.#streamData = [];
            this.#currentLength = 0;

            return new Error(`Maximum data size exceeded ${this.#maxRequestSize} exceeded`);
        }

        return undefined;
    }

    _write(chunk, encoding = BUFFER_ENCODING, next) {
        const error = this.#processChunk(chunk, encoding);
        return next(error);
    }

    _writev(chunks, next) {
        let error = undefined;
        for (const { chunk, encoding } of chunks) {
            error = this.#processChunk(chunk, encoding);
            if (error) {
                break;
            }
        }

        return next(error);
    }

    toString() {
        return decoder.write(Buffer.concat(this.#streamData, this.#currentLength));
    }

    getBuffer() {
        return Buffer.concat(this.#streamData, this.#currentLength);
    }

    getBuffers() {
        return this.#streamData;
    }

    getLength() {
        return this.#currentLength;
    }
}

export {
    WritableStream,
    MAX_REQUEST_SIZE
};
