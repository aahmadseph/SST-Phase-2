import {
    EventEmitter
} from 'events';
import {
    resolve,
    basename
} from 'path';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

class UFEEventEmitter extends EventEmitter {

    #currentListenerCount = 0;

    constructor() {
        super();
        this.#currentListenerCount = 0;
    }

    autoAdjustListenerCount() {
        const maxListeners = this.getMaxListeners();

        if ((this.#currentListenerCount + 1) >= maxListeners) {
            // just double the current
            const nSize = maxListeners * 2;
            this.setMaxListeners(nSize);
            logger.verbose(`Adding more listeners ${nSize}`);
        }
    }

    addOneListener() {
        this.#currentListenerCount++;
    }

    subtractOneListener() {
        this.#currentListenerCount--;
    }
}

export const emitter = new UFEEventEmitter();
