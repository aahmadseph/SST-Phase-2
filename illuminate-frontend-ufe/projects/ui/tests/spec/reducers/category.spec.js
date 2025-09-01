var categoryReducer = require('reducers/category').default;

describe('category reducer', () => {
    it('should return the initial state', () => {
        expect(categoryReducer(undefined, {})).toEqual({
            categories: null,
            currentCategory: null
        });
    });
});
