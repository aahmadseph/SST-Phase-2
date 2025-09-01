const ACTION_TYPES = {
    SET_FULL_RANGE_PRICES: 'set-full-range-prices',
    SET_CATALOG_DATA: 'set-catalog-data',
    SET_FILTER_BAR_VISIBILITY: 'SET_FILTER_BAR_VISIBILITY'
};

const initialState = {
    fullRangePrices: null,
    catalogData: null,
    filterBarHidden: false
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ACTION_TYPES.SET_FILTER_BAR_VISIBILITY:
            return {
                ...state,
                filterBarHidden: payload
            };

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
