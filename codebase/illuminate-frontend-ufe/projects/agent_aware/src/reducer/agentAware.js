import {
    CHANGE_NOTE_TYPE, RESET_NOTE_INFO, ADD_SAVE_NOTE_ERROR, ADD_NOTE_DESCRIPTION, UPDATE_USER, SHOW_MODAL_BY_NAME
} from 'actions/actionTypes';
import { INITIAL_NOTE_STATE } from 'hooks/useAgentAwareStore';

export const agentAwareReducer = (state, action) => {
    switch (action.type) {
        case CHANGE_NOTE_TYPE:
            return { ...state, note: { ...state.note, type: action.payload } };
        case ADD_SAVE_NOTE_ERROR:
            return { ...state, note: { ...state.note, saveNoteError: action.payload } };
        case ADD_NOTE_DESCRIPTION:
            return { ...state, note: { ...state.note, description: action.payload } };
        case RESET_NOTE_INFO:
            return { ...state, note: { ...INITIAL_NOTE_STATE } };
        case UPDATE_USER:
            return { ...state, user: { ...action.payload } };
        case SHOW_MODAL_BY_NAME:
            return { ...state, modalName: action.payload };
        default:
            return state;
    }
};
