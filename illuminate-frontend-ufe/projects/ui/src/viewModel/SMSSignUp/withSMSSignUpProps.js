import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import urlUtils from 'utils/Url';
import Actions from 'actions/Actions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showSMSSignInModal } = Actions;
const { redirectTo } = urlUtils;
const getText = getLocaleResourceFile('components/SMSSignUp/locales', 'SMSSignUp');

const fields = createSelector(
    userSelector,
    isAnonymousSelector,
    createStructuredSelector({
        signUp: getTextFromResource(getText, 'signUp'),
        mobile: getTextFromResource(getText, 'mobile'),
        continueBtn: getTextFromResource(getText, 'continueBtn'),
        emptyError: getTextFromResource(getText, 'emptyError'),
        invalidError: getTextFromResource(getText, 'invalidError')
    }),
    (user, isAnonymous, textResources) => {
        return {
            user,
            isAnonymous,
            localization: textResources
        };
    }
);

const openSmsSigninModal = (phoneNumber, extraParams) => dispatch => dispatch(showSMSSignInModal({ isOpen: true, phoneNumber, extraParams }));

const handleRedirect = (phoneNumber, origin) => () => redirectTo(`/beauty/text-alerts?phonenumber=${phoneNumber}&origin=${origin}`);

const functions = { openSmsSigninModal, handleRedirect };

const withSMSSignUpProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withSMSSignUpProps
};
