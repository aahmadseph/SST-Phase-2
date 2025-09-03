const ACTION_TYPES = {
    SHOW_TERMS_CONDITIONS_MODAL: 'SHOW_TERMS_CONDITIONS_MODAL',
    SHOW_CUSTOM_TERMS_CONDITIONS_MODAL: 'SHOW_CUSTOM_TERMS_CONDITIONS_MODAL',
    RRC_TERMS_CONDITIONS_ACCEPTED: 'RRC_TERMS_CONDITIONS_ACCEPTED',
    RRC_TERMS_CONDITIONS_CHECKED: 'RRC_TERMS_CONDITIONS_CHECKED'
};

const initialState = {
    isOpen: false,
    mediaId: '',
    title: '',
    message: '',
    isRRCTermsAndConditions: false,
    isRRCTermsAndConditionsChecked: false,
    callback: null
};

const reducer = function (state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_TERMS_CONDITIONS_MODAL:
            return Object.assign({}, state, {
                isOpen: action.isOpen,
                mediaId: action.mediaId,
                title: action.title,
                callback: action.callback
            });

        case ACTION_TYPES.SHOW_CUSTOM_TERMS_CONDITIONS_MODAL:
            return Object.assign({}, state, {
                isOpen: action.isOpen,
                title: action.title,
                message: action.message
            });

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
