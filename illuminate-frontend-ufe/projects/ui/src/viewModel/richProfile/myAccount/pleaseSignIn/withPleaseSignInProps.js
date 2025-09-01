import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import LanguageLocale from 'utils/LanguageLocale';
import auth from 'utils/Authentication';
import { HEADER_VALUE } from 'constants/authentication';

const getText = LanguageLocale.getLocaleResourceFile('components/RichProfile/MyAccount/PleaseSignIn/locales', 'PleaseSignIn');

const withPleaseSignInProps = connect(
    createSelector(
        () => getText('please'),
        please => {
            const signIn = getText('signIn');
            const toReviewSection = getText('toReviewSection');

            return {
                please,
                signIn,
                toReviewSection
            };
        }
    ),
    (_dispatch, { afterAuth }) => ({
        showSignInModal: () => {
            auth.requireAuthentication(true, null, null, null, false, HEADER_VALUE.USER_CLICK)
                .then(afterAuth)
                .catch(() => {});
        }
    })
);

export { withPleaseSignInProps };
