import termsConditions from 'reducers/termsConditions';
const { ACTION_TYPES: TYPES } = termsConditions;

export default {
    TYPES,

    showModal: function (isOpen, mediaId, title) {
        return {
            type: TYPES.SHOW_TERMS_CONDITIONS_MODAL,
            isOpen: isOpen,
            mediaId: mediaId,
            title: title
        };
    },

    showCustomModal: function (isOpen, title, message) {
        return {
            type: TYPES.SHOW_CUSTOM_TERMS_CONDITIONS_MODAL,
            isOpen: isOpen,
            title: title,
            message: message
        };
    }
};
