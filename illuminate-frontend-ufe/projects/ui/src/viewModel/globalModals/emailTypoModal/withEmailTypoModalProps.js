import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Actions from 'actions/Actions';

import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import isFunction from 'utils/functions/isFunction';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/EmailTypoModal/locales', 'EmailTypoModal');

const localization = createStructuredSelector({
    title: (state, ownProps) => getTextFromResource(getText, ownProps.isNewUserFlow ? 'titleNewUser' : 'title')(state),
    message: (state, ownProps) => getTextFromResource(getText, 'message', [ownProps.email])(state),
    ok: getTextFromResource(getText, 'ok'),
    cancel: getTextFromResource(getText, 'cancel')
});

const fields = createStructuredSelector({ localization });

const functions = (dispatch, ownProps) => {
    const { email, onCancel, onContinue } = ownProps;
    const onDismiss = () => dispatch(Actions.showEmailTypoModal({ isOpen: false }));

    return {
        onDismiss,
        onCancel: () => {
            onDismiss();

            if (isFunction(onCancel)) {
                // Use a custom onCancel cb when we trigger this modal when isNewUserFlow=false
                onCancel();
            } else {
                dispatch(
                    Actions.showEmailLookupModal({
                        isOpen: true,
                        originalArgumentObj: {
                            userEmail: email
                        }
                    })
                );
            }
        },
        onContinue: () => {
            onDismiss();

            if (isFunction(onContinue)) {
                // Use a custom onCancel cb when we trigger this modal when isNewUserFlow=false
                onContinue();
            } else {
                dispatch(
                    Actions.showRegisterModal({
                        isOpen: true,
                        userEmail: ownProps.email,
                        isEmailDisabled: true,
                        skipEmailLookup: true
                    })
                );
            }
        }
    };
};

const withEmailTypoModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withEmailTypoModalProps
};
