const reject = require('utils/functions/reject').default;

describe('reject', () => {
    it('Identity', () => {
        expect(reject([], () => {})).toEqual([]);

        expect(reject([1], () => {})).toEqual([1]);
    });

    it('Invalid Arguments', () => {
        expect(() => reject({})).toThrow(new Error('reject was called with [object Object] instead of []'));

        expect(() => reject([], undefined)).toThrow(new Error('reject was called with undefined instead of function'));
    });

    it('Valid Return Values', () => {
        expect(reject([1, 2, 3], num => num === 2)).toEqual([1, 3]);
    });
});
