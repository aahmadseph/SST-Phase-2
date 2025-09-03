import { SET_CMS_COMPONET_DATA, SET_CMS_COMPONET_INNER_DATA } from 'constants/actionTypes/cmsComponents';

export const setCMSComponentInnerData = (state, action) => {
    return {
        ...state,
        innerData: action.payload.items
    };
};

const mergeArrays = (arr1, arr2) => {
    const merged = [...arr1, ...arr2];
    const uniqueBySid = Array.from(merged.reduce((map, obj) => map.set(obj.sid, obj), new Map()).values());

    return uniqueBySid;
};

const initialState = {
    page: null,
    items: [],
    innerData: []
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_CMS_COMPONET_DATA:
            return {
                ...state,
                items: mergeArrays(state.items, action.payload.items)
            };
        case SET_CMS_COMPONET_INNER_DATA:
            return setCMSComponentInnerData(state, action);
        default:
            return state;
    }
};

const ACTION_TYPES = { SET_CMS_COMPONET_DATA, SET_CMS_COMPONET_INNER_DATA };

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
