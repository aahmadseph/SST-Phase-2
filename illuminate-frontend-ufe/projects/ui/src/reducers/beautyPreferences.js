import {
    SET_INITIAL_BEAUTY_PREFERENCES,
    SET_MULTIPLE_BEAUTY_PREFERENCES,
    SET_UPDATED_BEAUTY_PREFERENCES_MULTIPLE,
    CLEAR_BEAUTY_PREFERENCE,
    SET_COLOR_IQ,
    SET_EXPANDED_PREFERENCE,
    SET_PROFILE_COMPLETION_PERCENTAGE,
    SET_MAPPED_BRANDS_LIST,
    SET_IS_COLORIQ_LAST_ANSWERED_TRAIT,
    SET_FILTERED_OUT_USER_FAV_BRAND_IDS
} from 'constants/actionTypes/beautyPreferences';

const initialState = {
    beautyPreferences: {
        skinTone: [],
        skinConcerns: [],
        ageRange: [],
        skinType: [],
        hairConcerns: [],
        hairType: [],
        hairTexture: [],
        hairColor: [],
        eyeColor: [],
        shoppingPreferences: [],
        ingredientPreferences: [],
        colorIQ: [],
        favoriteBrands: [],
        fragranceFamily: []
    },
    expandedPreference: 'skinType',
    profileCompletionPercentage: 0,
    mappedBrandsList: null,
    isColorIQLastAnsweredTrait: false
};

const setColorIQ = (state, action) => {
    return {
        ...state,
        beautyPreferences: {
            ...state.beautyPreferences,
            colorIQ: action.payload.colorIQ
        }
    };
};

const setInitialBeautyPreferences = (state, action) => {
    return {
        ...state,
        beautyPreferences: {
            ...state.beautyPreferences,
            ...action.initialData
        }
    };
};

const setMultiplePreferences = (state, action) => {
    return {
        ...state,
        beautyPreferences: {
            ...state.beautyPreferences,
            [action.category]: action.selectedProfiles
        }
    };
};

const setUpdatedPreferences = (state, action) => {
    return {
        ...state,
        beautyPreferences: {
            ...state.beautyPreferences,
            ...action.data
        }
    };
};

const clearPreference = (state, action) => {
    return {
        ...state,
        beautyPreferences: {
            ...state.beautyPreferences,
            [action.category]: []
        }
    };
};

const setExpandedPreference = (state, action) => {
    return {
        ...state,
        expandedPreference: action.expandedPreference
    };
};

const setProfileCompletionPercentage = (state, action) => {
    return {
        ...state,
        profileCompletionPercentage: action.profileCompletionPercentage
    };
};

const setMappedBrandsList = (state, action) => {
    return {
        ...state,
        mappedBrandsList: action.payload.mappedBrandsList
    };
};

const setIsColorIQLastAnsweredTrait = (state, action) => {
    return {
        ...state,
        isColorIQLastAnsweredTrait: action.payload
    };
};

const setFilteredOutUserFavoriteBrandIDs = (state, action) => {
    return {
        ...state,
        beautyPreferences: {
            ...state.beautyPreferences,
            favoriteBrands: action.payload.favoriteBrands
        }
    };
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_BEAUTY_PREFERENCES:
            return setInitialBeautyPreferences(state, action);
        case SET_MULTIPLE_BEAUTY_PREFERENCES:
            return setMultiplePreferences(state, action);
        case CLEAR_BEAUTY_PREFERENCE:
            return clearPreference(state, action);
        case SET_COLOR_IQ:
            return setColorIQ(state, action);
        case SET_EXPANDED_PREFERENCE:
            return setExpandedPreference(state, action);
        case SET_PROFILE_COMPLETION_PERCENTAGE:
            return setProfileCompletionPercentage(state, action);
        case SET_MAPPED_BRANDS_LIST:
            return setMappedBrandsList(state, action);
        case SET_IS_COLORIQ_LAST_ANSWERED_TRAIT:
            return setIsColorIQLastAnsweredTrait(state, action);
        case SET_FILTERED_OUT_USER_FAV_BRAND_IDS:
            return setFilteredOutUserFavoriteBrandIDs(state, action);
        case SET_UPDATED_BEAUTY_PREFERENCES_MULTIPLE:
            return setUpdatedPreferences(state, action);
        default:
            return state;
    }
};

const ACTION_TYPES = {
    SET_INITIAL_BEAUTY_PREFERENCES,
    SET_MULTIPLE_BEAUTY_PREFERENCES,
    CLEAR_BEAUTY_PREFERENCE,
    SET_COLOR_IQ,
    SET_EXPANDED_PREFERENCE,
    SET_PROFILE_COMPLETION_PERCENTAGE,
    SET_MAPPED_BRANDS_LIST,
    SET_IS_COLORIQ_LAST_ANSWERED_TRAIT,
    SET_FILTERED_OUT_USER_FAV_BRAND_IDS,
    SET_UPDATED_BEAUTY_PREFERENCES_MULTIPLE
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
