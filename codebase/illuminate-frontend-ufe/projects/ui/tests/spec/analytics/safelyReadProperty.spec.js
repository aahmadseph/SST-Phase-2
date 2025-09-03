/* eslint max-len: [0] */

var safelyReadProperty = require('analytics/utils/safelyReadProperty').default;

describe('safelyReadProperty', () => {
    const startObject = {
        one: {
            two: {
                testProp: 'myValue',
                valueOfFalse: false
            }
        }
    };

    it('tries to read properties nested in mutilple object without causing errors', () => {
        expect(safelyReadProperty('one.two.testProp', startObject)).toEqual('myValue');
    });

    it('returns an empty string when it tries to read an undefined property', () => {
        expect(safelyReadProperty('one.two.three.four', startObject)).toEqual('');
    });

    it('returns false if the value is literally false', () => {
        expect(safelyReadProperty('one.two.valueOfFalse', startObject)).toEqual(false);
    });
});
