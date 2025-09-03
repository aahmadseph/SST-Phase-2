import {
    LogoutModal, AddNoteModal, SuccessNoteModal, CloseNoteConfirmationModal, SessionErrorModal
} from 'components/Modals';

export const MODAL_NAMES = {
    LOGOUT: 'logout',
    ADD_NOTE: 'add_note',
    SUCCESS_NOTE: 'success_note',
    CLOSE_NOTE_CONFIRMATION: 'close_note_confirmation',
    SESSION_ERROR: 'session_error'
};

export const modalComponents = {
    [MODAL_NAMES.LOGOUT]: LogoutModal,
    [MODAL_NAMES.ADD_NOTE]: AddNoteModal,
    [MODAL_NAMES.SUCCESS_NOTE]: SuccessNoteModal,
    [MODAL_NAMES.CLOSE_NOTE_CONFIRMATION]: CloseNoteConfirmationModal,
    [MODAL_NAMES.SESSION_ERROR]: SessionErrorModal
};
