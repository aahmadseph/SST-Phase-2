import React from 'react';
import Actions from 'Actions';
import { accountClosureCheck } from 'services/api/profile/accountClosureCheck';
import { confirmCloseAccount } from 'services/api/profile/confirmCloseAccount';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('actions/locales', 'AccountActions');
import UserActions from 'actions/UserActions';
const { signOut } = UserActions;
import CloseAccountSuccessful from 'components/GlobalModals/CloseAccountSuccessful';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const displayErrorModal = message => {
    return Actions.showInfoModal({
        isOpen: true,
        title: getText('closeAccount'),
        message,
        buttonText: getText('ok')
    });
};

const displayCloseAccountSuccessfulModal = callback => {
    return Actions.showInfoModal({
        isOpen: true,
        title: getText('closeAccount'),
        message: <CloseAccountSuccessful />,
        buttonText: getText('ok'),
        callback
    });
};

const displayCloseAccountModal = () => {
    return Actions.showCloseAccountModal({ isOpen: true });
};

const cancelCloseAccountModal = () => {
    return Actions.showCloseAccountModal({ isOpen: false });
};

const displayCheckPasswordModal = (errorMessages = []) => {
    return Actions.showCheckPasswordModal({ isOpen: true, errorMessages });
};

const cancelCheckPasswordModal = () => {
    return Actions.showCheckPasswordModal({ isOpen: false });
};

const checkAccountClosure = () => (dispatch, getState) => {
    const {
        user: { profileId }
    } = getState();

    return accountClosureCheck(profileId)
        .then(() => {
            dispatch(displayCloseAccountModal());
        })
        .catch(data => {
            if (data?.errorMessages?.length) {
                dispatch(displayErrorModal(data.errorMessages[0]));
            }
        });
};

const closeAccount = () => dispatch => {
    dispatch(cancelCloseAccountModal());
    dispatch(displayCheckPasswordModal());
};

const performPasswordCheck = password => dispatch => {
    confirmCloseAccount(password)
        .then(() => {
            Storage.local.setItem(LOCAL_STORAGE.USER_ACCOUNT_CLOSED, true);
            dispatch(signOut('/', false, false, undefined, `forceful logut for close account: ${window.location.pathname}`));
        })
        .catch(data => {
            if (data?.errorMessages?.length) {
                dispatch(displayCheckPasswordModal(data.errorMessages));
            }
        });
};

export default {
    checkAccountClosure,
    cancelCloseAccountModal,
    cancelCheckPasswordModal,
    closeAccount,
    performPasswordCheck,
    displayCloseAccountSuccessfulModal
};
