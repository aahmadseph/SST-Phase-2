import StoreHubActions from 'actions/StoreHubActions';
const { TYPES: ACTION_TYPES } = StoreHubActions;

/*
    UPDATE_ACTIVITIES:
        update list of all activity objects (filters applied)
        used to update carousel lists

    UPDATE_FILTERED_ACTIVITIES:
        - updates filteredActivityList :
            an array of activity objects set when user filters by type.
            if populated we display a grid of activity cards and hide
            the bcc content on the store hub page (carousels).
*/
const initialState = {};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_FILTERED_ACTIVITIES:
            return Object.assign({}, state, {
                typeFilteredActivities: action.typeFilteredActivities,
                startDateTime: action.startDateTime
            });
        case ACTION_TYPES.UPDATE_ACTIVITIES:
            return Object.assign({}, state, {
                allActivities: action.allActivities,
                typeFilteredActivities: null,
                startDateTime: action.startDateTime
            });
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
