import {
    CHANGE_NOTE_TYPE, RESET_NOTE_INFO, ADD_SAVE_NOTE_ERROR, ADD_NOTE_DESCRIPTION, UPDATE_USER, SHOW_MODAL_BY_NAME
} from 'actions/actionTypes';

const changeNoteType = noteType => ({ type: CHANGE_NOTE_TYPE, payload: noteType });

const resetNoteInfo = () => ({
    type: RESET_NOTE_INFO
});

const addSaveNoteError = errorDescription => ({
    type: ADD_SAVE_NOTE_ERROR,
    payload: errorDescription
});

const addNoteDescription = noteDescription => ({
    type: ADD_NOTE_DESCRIPTION,
    payload: noteDescription
});

const updateUser = user => ({
    type: UPDATE_USER,
    payload: user
});

const showModalByName = modalName => ({
    type: SHOW_MODAL_BY_NAME,
    payload: modalName
});

export default {
    changeNoteType,
    resetNoteInfo,
    addSaveNoteError,
    addNoteDescription,
    updateUser,
    showModalByName
};
