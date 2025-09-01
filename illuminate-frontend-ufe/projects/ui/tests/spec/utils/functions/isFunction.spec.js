const isFunction = require('utils/functions/isFunction').default;

describe('isFunction', () => {
    it('True', () => {
        expect(isFunction(() => {})).toBeTruthy();
        expect(isFunction(function () {})).toBeTruthy();
    });

    it('False', () => {
        expect(isFunction({})).toBeFalsy();
        expect(isFunction([])).toBeFalsy();
        expect(isFunction(null)).toBeFalsy();
        expect(isFunction(undefined)).toBeFalsy();
        expect(isFunction('')).toBeFalsy();
    });
});
