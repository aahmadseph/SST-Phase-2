import editDataReducer from 'reducers/editData';
const { ACTION_TYPES: TYPES } = editDataReducer;

function updateEditData(data, name) {
    return {
        type: TYPES.UPDATE_EDIT_ORDER_DATA,
        data: data,
        name: name
    };
}

function clearEditData(name) {
    return {
        type: TYPES.CLEAR_EDIT_DATA,
        name: name
    };
}

export default {
    TYPES,
    updateEditData,
    clearEditData
};
