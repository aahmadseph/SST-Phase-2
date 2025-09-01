import {
    SET_EVENTS, SET_APPLIED_EVENTS_FILTERS, SET_IS_LOADING, SET_STORES_LIST, SET_CURRENT_LOCATION
} from 'constants/actionTypes/events';
import happeningFilters from 'utils/happeningFilters';

const { defaultFilters } = happeningFilters;

const initialState = {
    data: {},
    appliedEventsFilters: defaultFilters,
    isLoading: false,
    storesList: [],
    currentLocation: {
        display: '',
        storeId: ''
    }
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_EVENTS: {
            const { data } = payload;

            return { ...state, data };
        }
        case SET_APPLIED_EVENTS_FILTERS: {
            return {
                ...state,
                appliedEventsFilters: payload
            };
        }
        case SET_IS_LOADING: {
            return {
                ...state,
                isLoading: payload
            };
        }
        case SET_STORES_LIST: {
            return {
                ...state,
                storesList: payload
            };
        }
        case SET_CURRENT_LOCATION: {
            return {
                ...state,
                currentLocation: payload
            };
        }
        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
