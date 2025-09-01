import { IndexedDBStorage } from 'utils/indexedDB';
import helpers from 'utils/Helpers';

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

const StorageTypes = {
    Local: 'localStorage',
    Session: 'sessionStorage',
    IndexedDB: 'UFE'
};

function isDataExpired(expiry) {
    return Date.parse(expiry) < new Date().getTime();
}

function Storage(storageType) {
    this.storageType = storageType;
    this.storage = window[storageType];
}

Storage.prototype.getItem = function (key, ignoreExpiry = false, removeExpired = false, returnDataWithExpiry = false) {
    const value = this.storage.getItem(key);
    let parsedValue;

    try {
        parsedValue = JSON.parse(value);
    } catch (e) {
        return null;
    }

    if (helpers.isObject(parsedValue)) {
        const { data = null, expiry = null } = parsedValue;

        if (expiry && !ignoreExpiry && isDataExpired(expiry)) {
            if (removeExpired) {
                this.removeItem(key);
            }

            return null;
        }

        return returnDataWithExpiry ? parsedValue : data;
    }

    return parsedValue;
};

Storage.prototype.setItem = function (key, value, expiry = null) {
    const data = { data: value };

    if (expiry) {
        const date = typeof expiry === 'number' ? new Date(Date.now() + expiry) : expiry;
        data.expiry = date;
    }

    try {
        this.storage.setItem(key, JSON.stringify(data));

        if (this.storageType === StorageTypes.Local) {
            digitalData.performance.localStorageSize = Object.keys(this.storage).reduce(
                (size, storageKey) => (storageKey.length + this.storage[storageKey].length) * 2 + size,
                0
            );
        }
    } catch {
        // Do nothing.
    }
};

Storage.prototype.removeItem = function (key) {
    return this.storage.removeItem(key);
};

Storage.prototype.removeAllBy = function (condition) {
    for (const key in this.storage) {
        if (condition(key)) {
            this.removeItem(key);
        }
    }
};

let local = {};
let session = {};
let db = {};

const errorMethods = storageType => {
    const errorMethod = (methodName, args) => {
        const key = args?.[0] || '';
        const errorMessage =
            `You cannot call the ${methodName} function on ${storageType} during server-side render.` +
            ` Key: ${key}. ` +
            'Refactor your code so that this function is called in a component lifecycle function instead of the render function.';
        throw new Error(errorMessage);
    };

    return ['getItem', 'setItem', 'removeItem', 'removeAllBy'].reduce((acc, methodName) => {
        acc[methodName] = (...args) => errorMethod(methodName, args);

        return acc;
    }, {});
};

if (!Sephora.isNodeRender) {
    local = new Storage(StorageTypes.Local);
    session = new Storage(StorageTypes.Session);
    db = new IndexedDBStorage(StorageTypes.IndexedDB);
} else {
    local = errorMethods('local');
    session = errorMethods('session');
    db = errorMethods('db');
}

export default {
    local,
    session,
    db,
    StorageTypes,
    SECONDS,
    MINUTES,
    HOURS,
    DAYS
};
