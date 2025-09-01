/* eslint-disable class-methods-use-this */
const _emptyArray = Object.freeze([]);
const _emptyObject = Object.freeze({});
const _emptyString = Object.freeze('');
// eslint-disable-next-line func-name-matching
const _emptyFunction = function emptyFunction() {};

class Empty {
    static get Array() {
        return _emptyArray;
    }

    static get Object() {
        return _emptyObject;
    }

    static get String() {
        return _emptyString;
    }

    static get Function() {
        return _emptyFunction;
    }
}

export default Empty;
