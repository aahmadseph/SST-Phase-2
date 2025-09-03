import historyService from 'services/History';
import historyLocation from 'reducers/framework/historyLocation';
const { ACTION_TYPES: TYPES } = historyLocation;

/**
 * @param locationObj object representing { path, queryParams, anchor }
 * path is a string with '/' at the front
 * queryParams should be an object with param names as keys, and related values as an array
 * or as a single string
 *  {
 *      paramName: ['param1', 'param2'],
 *      otherParam: 'other1'
 *  }
 * anchor is a string with '#'
 */
function goTo(locationObj) {
    const location = historyService.normalizeLocation(locationObj);
    historyService.pushToLocation(location);

    return {
        type: TYPES.UPDATE_CURRENT_LOCATION,
        location
    };
}

/**
 * @param locationObj object representing { path, queryParams, anchor }
 * path is a string with '/' at the front
 * queryParams should be an object with param names as keys, and related values as an array
 * or as a single string
 *  {
 *      paramName: ['param1', 'param2'],
 *      otherParam: 'other1'
 *  }
 * anchor is a string with '#' at the front
 */
function replaceLocation(locationObj) {
    const location = historyService.normalizeLocation(locationObj);
    historyService.replaceLocation(location);

    return {
        type: TYPES.UPDATE_CURRENT_LOCATION,
        location
    };
}

export default {
    TYPES,
    goTo,
    replaceLocation
};
