const ACTION_TYPES = {
    ADD_INTERSTICE_REQUEST: 'ADD_INTERSTICE_REQUEST',
    REMOVE_INTERSTICE_REQUEST: 'REMOVE_INTERSTICE_REQUEST',
    CLEAR_ALL_INTERSTICE_REQUESTS: 'CLEAR_ALL_INTERSTICE_REQUESTS'
};

const initialState = { requestList: [] };

const reducer = function (state = initialState, action) {
    let updatedList;

    switch (action.type) {
        case ACTION_TYPES.ADD_INTERSTICE_REQUEST:
            updatedList = new Set(Array.from(state.requestList));
            updatedList.add(action.requestId);

            return Object.assign({}, state, { requestList: [...updatedList] });
        case ACTION_TYPES.REMOVE_INTERSTICE_REQUEST:
            updatedList = new Set(state.requestList);
            updatedList.delete(action.requestId);

            return Object.assign({}, state, { requestList: [...updatedList] });
        case ACTION_TYPES.CLEAR_ALL_INTERSTICE_REQUESTS:
            return Object.assign({}, state, { requestList: [] });

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
