import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import actions from 'Actions';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocale from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/Homepage/SignInBanner/locales', 'SignInBanner');

export default connect(
    createStructuredSelector({
        user: userSelector,
        localization: createStructuredSelector({
            signInFree: getTextFromResource(getText, 'signInFree'),
            signInAccount: getTextFromResource(getText, 'signInAccount'),
            signInAccountLink: getTextFromResource(getText, 'signInAccountLink'),
            signInCTA: getTextFromResource(getText, 'signInCTA'),
            status: getTextFromResource(getText, 'status'),
            points: getTextFromResource(getText, 'points'),
            join: getTextFromResource(getText, 'join'),
            earn: getTextFromResource(getText, 'earn'),
            ccRewards: getTextFromResource(getText, 'ccRewards')
        })
    }),
    {
        showSignInModal: actions.showSignInModal,
        showRegisterModal: actions.showRegisterModal,
        showBiRegisterModal: actions.showBiRegisterModal
    }
);
