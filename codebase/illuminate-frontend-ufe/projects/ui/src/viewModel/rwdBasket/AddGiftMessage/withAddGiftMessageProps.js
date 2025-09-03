import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Action from 'Actions';
import GiftMessageApiService from 'services/api/giftMessage';

const { getGiftMessageThemes } = GiftMessageApiService;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showAddGiftMessageModal, showRemoveGiftMessageModal } = Action;

const getText = getLocaleResourceFile('components/AddGiftMessage/locales', 'AddGiftMessage');

const localization = createStructuredSelector({
    addGiftMessage: getTextFromResource(getText, 'addGiftMessage'),
    giftMessageAdded: getTextFromResource(getText, 'giftMessageAdded'),
    edit: getTextFromResource(getText, 'edit'),
    remove: getTextFromResource(getText, 'remove')
});

const fields = createSelector(localization, textResources => {
    return { localization: textResources };
});

const functions = dispatch => ({
    openAddGiftMessageModal: (languageThemes, orderId) => {
        const action = showAddGiftMessageModal({ isOpen: true, languageThemes, orderId });
        dispatch(action);
    },
    openRemoveGiftMessageModal: orderId => {
        const action = showRemoveGiftMessageModal({ isOpen: true, orderId });
        dispatch(action);
    },
    getGiftMessageThemes,
    openEditGiftMessageModal: (languageThemes, orderId) => {
        const action = showAddGiftMessageModal({ isOpen: true, languageThemes, orderId, isEditGiftMessage: true });
        dispatch(action);
    }
});

const withAddGiftMessageProps = wrapHOC(connect(fields, functions));

export {
    withAddGiftMessageProps, fields, functions, localization
};
