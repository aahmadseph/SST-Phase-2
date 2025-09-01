const React = require('react');
const { objectsAreEqual } = require('utils/framework/wrapComponentRender').default();

describe('objectsAreEqual', () => {
    it('should return false for the same React component instances', () => {
        const component1 = React.createElement('div');
        const component2 = component1;

        expect(objectsAreEqual(component1, component2, 0)).toBe(false);
    });

    it('should return false for different React component instances', () => {
        const component1 = React.createElement('div');
        const component2 = React.createElement('div');

        expect(objectsAreEqual(component1, component2, 0)).toBe(false);
    });

    it('should return true for the same React ref objects', () => {
        const ref1 = React.createRef();
        ref1.current = { a: 1 };
        const ref2 = ref1;

        expect(objectsAreEqual(ref1, ref2, 0)).toBe(true);
    });

    it('should return false for different React ref objects', () => {
        const ref1 = React.createRef();
        ref1.current = { a: 1 };
        const ref2 = React.createRef();
        ref2.current = { a: 1 };

        expect(objectsAreEqual(ref1, ref2, 0)).toBe(false);
    });

    it('should return true for deeply equal objects', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 2 } };

        expect(objectsAreEqual(obj1, obj2, 0)).toBe(true);
    });

    it('should return false for objects with different values', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 3 } };

        // expect(objectsAreEqual(obj1, obj2, 0)).toBe(false);
        expect(() => objectsAreEqual(obj1, obj2, 0)).toThrowError('objectsNotEqualOnSomeLevel: c, depth: 2');
    });
});
