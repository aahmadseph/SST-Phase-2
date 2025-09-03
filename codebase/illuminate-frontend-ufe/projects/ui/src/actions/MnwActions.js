import Actions from 'Actions';
import languageLocaleUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/ResetPassword/locales', 'ResetPassword');
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UrlUtils from 'utils/Url';

function showPasswordResetRecommendation(message) {
    return dispatch => {
        // Skip for Now button and X button
        const cancelCallback = () => {
            Storage.local.removeItem(LOCAL_STORAGE.LOGIN_PROFILE_WARNINGS);
            dispatch(Actions.showInfoModal({ isOpen: false }));
        };

        dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: getText('resetYourPassword'),
                message,
                buttonText: getText('continue'),
                cancelText: getText('skipForNow'),
                showCancelButtonLeft: true,
                cancelButtonCallback: cancelCallback,
                cancelCallback: cancelCallback,
                callback: () => {
                    cancelCallback();
                    UrlUtils.redirectTo('/profile/MyAccount#editPassword');
                },
                bodyPaddingBottom: 4
            })
        );
    };
}

function showPasswordResetAfterSignup(message) {
    return dispatch => {
        // Continue Anyway button and X button
        const callback = () => {
            Storage.local.removeItem(LOCAL_STORAGE.LOGIN_PROFILE_WARNINGS);
            dispatch(Actions.showInfoModal({ isOpen: false }));
        };

        const cancelCallback = () => {
            callback();
            UrlUtils.redirectTo('/profile/MyAccount#editPassword');
        };

        dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: getText('changePassword'),
                message,
                buttonText: getText('continueAnyway'),
                cancelText: getText('changePassword'),
                showCancelButtonLeft: true,
                cancelButtonCallback: cancelCallback,
                cancelCallback: callback,
                callback: callback,
                bodyPaddingBottom: 4
            })
        );
    };
}

export default {
    showPasswordResetRecommendation,
    showPasswordResetAfterSignup
};
