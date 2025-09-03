import intersticeRequests from 'reducers/intersticeRequests';
const { ACTION_TYPES: TYPES } = intersticeRequests;

function add(requestId) {
    return {
        type: TYPES.ADD_INTERSTICE_REQUEST,
        requestId: requestId
    };
}

function remove(requestId) {
    return {
        type: TYPES.REMOVE_INTERSTICE_REQUEST,
        requestId: requestId
    };
}

function clear() {
    return { type: TYPES.CLEAR_ALL_INTERSTICE_REQUESTS };
}

export default {
    TYPES,
    add: add,
    remove: remove,
    clear: clear
};
