import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'actions/Actions';
import UserActions from 'actions/UserActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import EmailLookupModalBindings from 'analytics/bindingMethods/components/globalModals/emailLookupModal/EmailLookupModalBindings';
import { HEADER_VALUE } from 'constants/authentication';
import userUtils from 'utils/User';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/EmailLookupModal/locales', 'EmailLookupModal');

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    joinBiProgram: getTextFromResource(getText, 'joinBiProgram'),
    joinBookingBiProgram: getTextFromResource(getText, 'joinBookingBiProgram'),
    email: getTextFromResource(getText, 'email'),
    confirmButton: getTextFromResource(getText, 'confirmButton'),
    alreadyHaveAccount: getTextFromResource(getText, 'alreadyHaveAccount'),
    signIn: getTextFromResource(getText, 'signIn')
});

const fields = createStructuredSelector({
    localization
});

const functions = (dispatch, ownProps) => {
    const closeEmailLookupModal = () => dispatch(Actions.showEmailLookupModal({ isOpen: false }));

    return {
        onDismiss: () => {
            closeEmailLookupModal();
            typeof ownProps.originalArgumentsObj?.errback === 'function' && ownProps.originalArgumentsObj.errback();
        },
        showSignInModal: () => {
            closeEmailLookupModal();
            dispatch(
                Actions.showSignInModal({
                    ...ownProps.originalArgumentsObj,
                    isOpen: true,
                    extraParams: {
                        ...ownProps.originalArgumentsObj?.extraParams,
                        headerValue: HEADER_VALUE.USER_CLICK
                    }
                })
            );
        },
        checkUser: (email, showInputLevelErrorCb) => {
            const showRegisterModal = () => {
                const isBookingFlow = ownProps.originalArgumentsObj?.extraParams?.isBookingFlow ?? false;
                dispatch(
                    Actions.showRegisterModal({
                        ...ownProps.originalArgumentsObj,
                        isOpen: true,
                        userEmail: email,
                        isEmailDisabled: true,
                        skipEmailLookup: true,
                        isSSIEnabled: isBookingFlow
                    })
                );
            };

            const successCallback = data => {
                closeEmailLookupModal();

                if (data.isStoreBiMember) {
                    dispatch(Actions.showCheckYourEmailModal({ isOpen: true, email }));
                } else {
                    const existingUserError = getText('existingUserError');
                    dispatch(
                        Actions.showSignInModal({
                            ...ownProps.originalArgumentsObj,
                            isOpen: true,
                            email,
                            messages: [existingUserError]
                        })
                    );
                }
            };

            const failureCallback = error => {
                if (userUtils.isEmailDisposableError(error)) {
                    const invalidEmailError = getText('invalidEmailError');

                    showInputLevelErrorCb(invalidEmailError);
                } else if (userUtils.isEmailTypoError(error)) {
                    closeEmailLookupModal();

                    dispatch(
                        Actions.showEmailTypoModal({
                            isOpen: true,
                            isNewUserFlow: true,
                            email,
                            onContinue: () => dispatch(Actions.showCheckYourEmailModal({ isOpen: true, email }))
                        })
                    );
                } else if (userUtils.isEmailVerifyError(error)) {
                    closeEmailLookupModal();

                    dispatch(Actions.showCheckYourEmailModal({ isOpen: true, email }));
                } else {
                    closeEmailLookupModal();
                    showRegisterModal();
                }
            };

            dispatch(UserActions.checkUser(email, successCallback, failureCallback));
        },
        pageLoadAnalytics: EmailLookupModalBindings.pageLoad
    };
};

const withEmailLookupModalProps = wrapHOC(connect(fields, functions));

export {
    withEmailLookupModalProps, fields, functions
};
