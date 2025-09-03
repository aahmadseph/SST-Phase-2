// Do not use this for large objects.
function getObjectValuesSlowNDirty(obj) {
    const values = [];

    if (!obj) {
        return values;
    }

    const keys = Object.keys(obj);

    for (let i = 0, l = keys.length; i < l; i++) {
        const k = keys[i];
        const val = obj[k];

        if (values.indexOf(val) === -1) {
            values.push(val);
        }
    }

    return values;
}

/**
 * @param {Object} obj
 * @param {Function} existsInList Function that tests a given key against a list of valid keys.
 * @param {Boolean} recursive Whether to apply filterObjectValuesByKey for nested objects, if any.
 */
function filterObjectValuesByKey(obj, existsInList, recursive = false) {
    const isTestFunctionValid = typeof existsInList === 'function';
    let result = [];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (isTestFunctionValid && existsInList(key)) {
                result.push(value);
            }

            if (recursive && !!value && typeof value === 'object' && value !== null) {
                result = result.concat(filterObjectValuesByKey(value, existsInList, recursive));
            }
        }
    }

    return result;
}

// Because of IE, Array.find is prohibited to us.
function findInArray(array, callback) {
    let result;

    for (const one of array) {
        if (callback(one)) {
            result = one;

            break;
        }
    }

    return result;
}

function getKeyByValue(object, value) {
    const adjustedObject = (typeof object === 'object' && object !== null) || typeof object === 'function' ? object : {};

    return findInArray(Object.keys(adjustedObject), key => adjustedObject[key] === value);
}

function buildMap(obj) {
    const map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });

    return map;
}

function isObjectEmpty(obj) {
    /* eslint-disable guard-for-in */
    let isEmpty = true;

    // eslint-disable-next-line no-unused-vars
    for (const k in obj) {
        isEmpty = false;

        break;
    }

    return isEmpty;
}

function getObjects(obj, key, val) {
    /* eslint-disable no-continue */
    let objects = [];
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object') {
            objects = objects.concat(this.getObjects(obj[prop], key, val));
        } else {
            // if key matches and value matches or if key matches and value is not passed
            // (eliminating the case where key matches but passed value does not)
            if ((prop === key && obj[prop] === val) || (prop === key && val === '')) {
                objects.push(obj);
            } else if (obj[prop] === val && key === '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) === -1) {
                    objects.push(obj);
                }
            }
        }
    });

    return objects;
}

function bind(source, self) {
    const thisWrap = Object.assign({}, source);
    Object.keys(thisWrap).forEach(prop => {
        if (typeof thisWrap[prop] === 'function') {
            thisWrap[prop] = thisWrap[prop].bind(self);
        }
    });

    return thisWrap;
}

/**
 * closer javascript polyfill
 * @param {*} arr an arry to parse
 * @param {*} depth =0 -> returns the upflattened array, =1 flattens only 1 level deeper
 */
/* eslint-disable no-extend-native */
if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth = 1) {
        return this.reduce(
            (result, item) =>
                (depth === 0 ? result.push(item) : Array.isArray(item) ? result.push(...item.flat(depth - 1)) : result.push(item)) && result,
            []
        );
    };
}

export default {
    getKeyByValue,
    getObjectValuesSlowNDirty,
    filterObjectValuesByKey,
    findInArray,
    buildMap,
    isObjectEmpty,
    getObjects,
    bind
};
