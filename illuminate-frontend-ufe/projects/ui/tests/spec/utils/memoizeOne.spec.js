const memoizeOne = require('utils/memoizeOne').default;

describe('memoizeOne', () => {
    let func;
    beforeEach(() => {
        func = jasmine.createSpy().and.returnValue('1984');
    });

    it('should return a function', () => {
        const memoized = memoizeOne(func);

        expect(typeof memoized).toBe('function');
    });

    it('should call memoized function for the first time', () => {
        const memoized = memoizeOne(func);

        const result = memoized();

        expect(result).toBe('1984');
        expect(func).toHaveBeenCalledWith();
    });

    it('should not call memoized function with the same argument', () => {
        const memoized = memoizeOne(func);

        const result1 = memoized();
        const result2 = memoized();

        expect(result1).toBe('1984');
        expect(result2).toBe('1984');

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith();
    });

    it('should not call memoized function with the same argument if it is a function', () => {
        const memoized = memoizeOne(func);

        const argument = () => 5;
        const result1 = memoized(argument);
        const result2 = memoized(argument);

        expect(result1).toBe('1984');
        expect(result2).toBe('1984');

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(argument);
    });

    it('should not call memoized function with the same argument if it is an object', () => {
        const memoized = memoizeOne(func);

        const argument = {};
        const result1 = memoized(argument);
        const result2 = memoized(argument);

        expect(result1).toBe('1984');
        expect(result2).toBe('1984');

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(argument);
    });

    it('should call memoized function with a different argument', () => {
        const memoized = memoizeOne(func);

        const result1 = memoized();
        const result2 = memoized('x');

        expect(result1).toBe('1984');
        expect(result2).toBe('1984');

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenCalledWith();
        expect(func).toHaveBeenCalledWith('x');
    });

    it('should call memoized function with a different argument if it is a function', () => {
        const memoized = memoizeOne(func);

        const argument1 = () => 5;
        const argument2 = () => 3;
        const result1 = memoized(argument1);
        const result2 = memoized(argument2);

        expect(result1).toBe('1984');
        expect(result2).toBe('1984');

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenCalledWith(argument1);
        expect(func).toHaveBeenCalledWith(argument2);
    });

    it('should call memoized function with a different argument if it is an object', () => {
        const memoized = memoizeOne(func);

        const argument1 = {};
        const argument2 = {};
        const result1 = memoized(argument1);
        const result2 = memoized(argument2);

        expect(result1).toBe('1984');
        expect(result2).toBe('1984');

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenCalledWith(argument1);
        expect(func).toHaveBeenCalledWith(argument2);
    });

    it('should use "getMemoizationKey" and skip calling a function for the 2nd time', () => {
        const memoized = memoizeOne(func, (a, b) => a * b);

        memoized(2, 3);
        memoized(3, 2);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(2, 3);
    });

    it('should use "getMemoizationKey" and call a function if key is new', () => {
        const memoized = memoizeOne(func, (a, b) => a * b);

        memoized(2, 3);
        memoized(2, 2);

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenCalledWith(2, 3);
        expect(func).toHaveBeenCalledWith(2, 2);
    });
});
