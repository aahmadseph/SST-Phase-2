/* eslint class-methods-use-this: 0 */
import {
    Writable
} from 'node:stream';

// setup dev null stream to fix the EPIPE error we were seeing in the client
export default class NullStream extends Writable {

    constructor(opts = {}) {
        super(opts);
        this.opts = opts;
    }

    _write(chunk, encoding, callback) {
        return callback();
    }
}
