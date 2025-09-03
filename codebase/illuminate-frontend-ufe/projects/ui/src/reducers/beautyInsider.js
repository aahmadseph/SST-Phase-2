const ACTION_TYPES = {
    SET_BI_PERSONALIZED_OFFERS: 'SET_BI_PERSONALIZED_OFFERS'
};

const initialState = {
    biRewardGroups: null,
    biPersonalizedOffers: null,
    summary: null
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_BI_PERSONALIZED_OFFERS:
            return {
                ...state,
                biPersonalizedOffers: action.payload
            };
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
