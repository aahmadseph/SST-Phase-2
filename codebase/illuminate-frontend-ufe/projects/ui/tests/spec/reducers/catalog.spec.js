const catalogReducer = require('reducers/catalog').default;

describe('catalog reducers', () => {
    it('should return the initial state', () => {
        expect(catalogReducer(undefined, {})).toEqual({
            fullRangePrices: null,
            catalogData: null,
            filterBarHidden: false
        });
    });
});
