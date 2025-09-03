const ACTION_TYPES = { UPDATE_CURRENT_LOCATION: 'update-current-location' };
import { NOT_INITIALIZED } from 'constants/location';

const initialState = {
    path: NOT_INITIALIZED,
    queryParams: NOT_INITIALIZED,
    anchor: NOT_INITIALIZED
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_CURRENT_LOCATION: {
            const { path, queryParams, anchor, prevPath } = action.location;

            return Object.assign({}, state, {
                path,
                queryParams,
                anchor,
                prevPath
            });
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
