const Helpers = require('utils/Helpers').default;

describe('Helpers utils', () => {
    describe('isObject function', () => {
        it('should return true if object literal is passed', () => {
            expect(Helpers.isObject({})).toBe(true);
        });

        it('should return true if Object instance is passed', () => {
            expect(Helpers.isObject({})).toBe(true);
        });

        it('should return true if Object.create() is passed', () => {
            expect(Helpers.isObject(Object.create({}))).toBe(true);
        });

        it('should return false if nothing is passed', () => {
            expect(Helpers.isObject()).toBe(false);
        });

        it('should return false if undefined is passed', () => {
            expect(Helpers.isObject(undefined)).toBe(false);
        });

        it('should return false if a number is passed', () => {
            expect(Helpers.isObject(3)).toBe(false);
        });

        it('should return false if a string is passed', () => {
            expect(Helpers.isObject('hello')).toBe(false);
        });

        it('should return false if a boolean is passed', () => {
            expect(Helpers.isObject(false)).toBe(false);
        });

        it('should return false if array literal is passed', () => {
            expect(Helpers.isObject([])).toBe(false);
        });

        it('should return false if Array instance is passed', () => {
            expect(Helpers.isObject([])).toBe(false);
        });

        it('should return false if null is passed', () => {
            expect(Helpers.isObject(null)).toBe(false);
        });

        it('should return false if an anonymous function is passed', () => {
            expect(Helpers.isObject(function () {})).toBe(false);
        });

        it('should return false if a function expression is passed', () => {
            const fn = function fn() {};
            expect(Helpers.isObject(fn)).toBe(false);
        });
    });

    describe('removeDuplicatesInArray filters out duplicate items from given array', () => {
        let arrayWithDuplicates, arrayWithoutDuplicates;

        beforeEach(() => {
            arrayWithDuplicates = [
                {
                    productId: 'P04897543',
                    skuId: '1925528'
                },
                {
                    productId: 'P39784685',
                    skuId: '1925932'
                },
                {
                    productId: 'P04897543',
                    skuId: '1925528'
                }
            ];

            arrayWithoutDuplicates = [
                {
                    productId: 'P04897543',
                    skuId: '1925528'
                },
                {
                    productId: 'P39784685',
                    skuId: '1925932'
                }
            ];
        });

        it('should remove the duplicate object', function () {
            const uniqueArray = Helpers.removeDuplicatesInArray(arrayWithDuplicates, 'skuId');
            expect(uniqueArray).toEqual(arrayWithoutDuplicates);
        });

        it('should not error, but ignore array items that are not objects', function () {
            arrayWithoutDuplicates.concat(['item1', 'item2']);
            const uniqueArray = Helpers.removeDuplicatesInArray(arrayWithoutDuplicates, 'skuId');
            expect(uniqueArray).toEqual(arrayWithoutDuplicates);
        });

        it('should return false when int is provided as first parameter', function () {
            const uniqueArray = Helpers.removeDuplicatesInArray(1, 'skuId');
            expect(uniqueArray).toEqual(false);
        });

        it('should return false when int is provided as second parameter', function () {
            const uniqueArray = Helpers.removeDuplicatesInArray(arrayWithDuplicates, 1);
            expect(uniqueArray).toEqual(false);
        });

        it('should return the same array when an array has no duplicates', function () {
            const uniqueArray = Helpers.removeDuplicatesInArray(arrayWithoutDuplicates, 'skuId');
            expect(uniqueArray).toEqual(arrayWithoutDuplicates);
        });

        it('should remove one string item from the array', function () {
            const tempArray = ['ufe', 'react', 'ufe'];
            const uniqueArray = Helpers.removeDuplicatesInArray(tempArray);
            expect(uniqueArray).toEqual(['ufe', 'react']);
        });

        it('should remove one number item from the array', function () {
            const tempArray = [4, 5, 3, 4, 1];
            const uniqueArray = Helpers.removeDuplicatesInArray(tempArray);
            expect(uniqueArray).toEqual([4, 5, 3, 1]);
        });
    });

    describe('getProp function', () => {
        let myObject;

        beforeEach(() => {
            myObject = { shallowProperty: { deepProperty: 'my deep property' } };
        });

        it('should return found value in object', () => {
            expect(Helpers.getProp(myObject, 'shallowProperty.deepProperty')).toBe('my deep property');
        });

        it('should return undefined if the function doesn\'t has default value', () => {
            expect(Helpers.getProp(myObject, 'shallowProperty.otherDeepProperty')).toBe(undefined);
        });

        it('should return false if the function doesn\'t found the value into the object', () => {
            expect(Helpers.getProp(myObject, 'shallowProperty.otherDeepProperty', false)).toBe(false);
        });
    });

    describe('replaceDoubleAsterisks function', () => {
        it('should replace double asterisks for single asterisks', () => {
            expect(Helpers.replaceDoubleAsterisks('**one****two** **three**')).toBe('*one**two* *three*');
        });

        it('should return the same string if there are no doubl asterisks', () => {
            expect(Helpers.replaceDoubleAsterisks('I *have* just single *asterisks*')).toBe('I *have* just single *asterisks*');
        });
    });

    describe('fixArrayResponse function', () => {
        it('should return null for null input', () => {
            const result = Helpers.fixArrayResponse(null);

            expect(result).toBe(null);
        });

        it('should return undefined for undefined input', () => {
            const result = Helpers.fixArrayResponse(undefined);

            expect(result).toBe(undefined);
        });

        it('should return the original input (number) when it is not an object', () => {
            const result = Helpers.fixArrayResponse(100);

            expect(result).toBe(100);
        });

        it('should return the original input (array) when it is not an object', () => {
            const result = Helpers.fixArrayResponse([1, 2]);

            expect(result).toEqual([1, 2]);
        });

        it('should return the original input (object) for an invalid structure', () => {
            const result = Helpers.fixArrayResponse({ 3: { a: 1 }, 2: { b: 2 }, test: 200 });

            expect(result).toEqual({ 3: { a: 1 }, 2: { b: 2 }, test: 200 });
        });

        it('should return the expect output with data property for a given input', () => {
            const result = Helpers.fixArrayResponse({ 0: { a: 1 }, 1: { b: 2 } });

            expect(result).toEqual({ data: [{ a: 1 }, { b: 2 }] });
        });

        it('should return the expect output with data property and responseStatus for a given input (a)', () => {
            const result = Helpers.fixArrayResponse({ 0: { a: 1 }, 1: { b: 2 }, responseStatus: 200 });

            expect(result).toEqual({ data: [{ a: 1 }, { b: 2 }], responseStatus: 200 });
        });

        it('should return the expect output with data property and responseStatus for a given input (b)', () => {
            const result = Helpers.fixArrayResponse({ 0: 1, 1: 2, 2: 3, responseStatus: 200 });

            expect(result).toEqual({ data: [1, 2, 3], responseStatus: 200 });
        });
    });
});
