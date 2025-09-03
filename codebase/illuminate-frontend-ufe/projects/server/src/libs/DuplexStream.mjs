/* eslint-disable object-curly-newline */
import {
    StringDecoder
} from 'node:string_decoder';
import {
    Duplex
} from 'node:stream';

import {
    MAX_REQUEST_SIZE
} from '#server/config/envConfig.mjs';

const BUFFER_ENCODING = 'utf8',
    DEFAULT_CHUNK_SIZE = 65536;

const decoder = new StringDecoder(BUFFER_ENCODING);

// this is our custom writeable stream implementation
// it stores data as buffers and lets you acceee the buffer or the string
// works well with the request object

class DuplexStream extends Duplex {

    #buffers = [];
    #currentLength = [];
    #chunkSize = DEFAULT_CHUNK_SIZE;
    #index = 0;
    #maxRequestSize = MAX_REQUEST_SIZE;

    // setup dev null stream to fix the EPIPE error we were seeing in the client
    constructor(opts = {}) {
        super(opts);

        this.objectMode = opts.objectMode || true;

        this.#buffers = [];
        this.#currentLength = 0;
        this.#maxRequestSize = opts.maxRequestSize || MAX_REQUEST_SIZE;

        if (this.#maxRequestSize <= 0) {
            throw new Error(`Invalid max request size ${this.#maxRequestSize}`);
        }

        this.#chunkSize = opts.chunkSize || DEFAULT_CHUNK_SIZE;
        this.#index = 0;

        this.once('finish', () => {
            this._read();
            this.push(null);
        });
    }

    #processChunk(chunk, _encoding) {
        this.#buffers.push(chunk);
        this.#currentLength += chunk.length;

        // allowing no max size, which is dangerous, but might be necessary when we
        // don't know how big we can allow like a page with SEO embedded content
        if (this.#currentLength > this.#maxRequestSize) {
            this.#buffers = [];
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

    #pushParts(streamData, readSize) {
        const parts = Math.ceil(streamData.length / readSize),
            endReadSize = readSize - 1;

        for (let i = 0; i < parts; i++) {
            const index = i * readSize;
            const chunk = streamData.slice(index, i + endReadSize);
            this.push(chunk);
        }
    }

    _read(size) {
        const readSize = size || this.#chunkSize;

        while (this.#index < this.#buffers.length) {
            const streamData = this.#buffers[this.#index];

            if (streamData) {
                if (streamData.length <= readSize) {
                    this.push(streamData);
                } else {
                    this.#pushParts(streamData, readSize);
                }
            }

            this.#index++;
        }
    }

    toString() {
        return decoder.write(Buffer.concat(this.#buffers, this.#currentLength));
    }

    getBuffer() {
        return Buffer.concat(this.#buffers, this.#currentLength);
    }

    getBuffers() {
        return this.#buffers;
    }

    getLength() {
        return this.#currentLength;
    }
}

export {
    DuplexStream
};
