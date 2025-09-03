import {
    Readable
} from 'node:stream';

const DEFAULT_CHUNK_SIZE = 32768;

export default class StringToStream extends Readable {

    #chunkSize = DEFAULT_CHUNK_SIZE;
    #startPosition = 0;
    #index = 0;
    #length = 0;

    constructor(opts = {}) {
        super(opts);
        this.objectMode = opts.objectMode || true;

        this.data = opts.data || '';
        this.#length = this.data.length;
        this.#chunkSize = opts.chunkSize || DEFAULT_CHUNK_SIZE;
        this.#index = 0;
        this.#startPosition = 0;
    }

    _read(_size) {
        if (this.#startPosition < this.#length) {
            const chunk = this.data.slice(this.#startPosition, this.#startPosition + this.#chunkSize);
            this.push(chunk);
            this.#startPosition += this.#chunkSize;
            this.#index++;
        } else {
            this.push(null);
        }
    }
}
