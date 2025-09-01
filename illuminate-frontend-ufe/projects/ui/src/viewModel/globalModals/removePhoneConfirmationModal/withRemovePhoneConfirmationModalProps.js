import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Actions from 'actions/Actions';

import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/RemovePhoneConfirmationModal/locales', 'RemovePhoneConfirmationModal');

const localization = createStructuredSelector({
    message: (state, ownProps) => getTextFromResource(getText, 'message', [ownProps.phoneNumber])(state),
    title: state => getTextFromResource(getText, 'title')(state),
    messageLine2: state => getTextFromResource(getText, 'messageLine2')(state),
    ok: getTextFromResource(getText, 'ok'),
    cancel: getTextFromResource(getText, 'cancel')
});

const fields = createStructuredSelector({ localization });

const functions = (dispatch, ownProps) => {
    const { onCancel, onContinue } = ownProps;
    const closeRemovePhoneConfirmationModal = () => dispatch(Actions.showRemovePhoneConfirmationModal({ isOpen: false }));
    const onCancelHandler = () => {
        closeRemovePhoneConfirmationModal();

        if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    return {
        onCancel: onCancelHandler,
        onContinue
    };
};

const withRemovePhoneConfirmationModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withRemovePhoneConfirmationModalProps
};
