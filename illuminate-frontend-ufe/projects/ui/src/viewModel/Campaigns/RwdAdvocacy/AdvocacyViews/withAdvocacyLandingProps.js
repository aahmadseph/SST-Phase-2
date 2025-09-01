import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import Actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacyLanding/locales', 'AdvocacyLanding');

const { wrapHOC } = FrameworkUtils;
const { showSignInModal, showBiRegisterModal, showRegisterModal } = Actions;

const localization = createStructuredSelector({
    joinNow: getTextFromResource(getText, 'joinNow'),
    createAccount: getTextFromResource(getText, 'createAccount'),
    signIn: getTextFromResource(getText, 'signIn')
});

const fields = createSelector(userSelector, localization, (user, locales) => {
    return {
        user,
        locales
    };
});

const functions = {
    showSignInModal,
    showBiRegisterModal,
    showRegisterModal
};

const withAdvocacyLandingProps = wrapHOC(connect(fields, functions));

export {
    withAdvocacyLandingProps, fields, functions
};
