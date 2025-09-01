import actions from 'actions/Actions';
import store from 'store/Store';

import localeUtils from 'utils/LanguageLocale';

import anaConsts from 'analytics/constants';
import { UPDATE_PASSKEYS } from 'constants/actionTypes/user';

import passkeysApi from 'services/api/authentication/passkeys';
import processEvent from 'analytics/processEvent';

const getText = localeUtils.getLocaleResourceFile('actions/locales', 'PasskeysActions');

const getAvailablePasskeysManually = (passkeys, removedPasskey) => passkeys.filter(passkey => passkey.passkeyId !== removedPasskey.passkeyId);

const removePasskey = (passkeys, passkeyToRemove, userData) => {
    store.dispatch(actions.showInterstice(true));

    passkeysApi
        .removePasskey(passkeyToRemove.passkeyId, userData)
        .then(removePasskeyResponse => {
            if (removePasskeyResponse.responseStatus !== 200 || removePasskeyResponse?.errors?.[0]?.errorCode) {
                throw new Error(removePasskeyResponse.errors[0].errorMessage);
            }

            // Analytics
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [`${anaConsts.Event.EVENT_289}=1`]
                }
            });

            return passkeysApi
                .getPasskeys()
                .then(getPasskeysResponse => {
                    if (!getPasskeysResponse || getPasskeysResponse?.errors?.[0]?.errorCode) {
                        throw new Error(getPasskeysResponse.errors[0].errorMessage);
                    }

                    return processNewPasskeys(getPasskeysResponse);
                })
                .catch(() => {
                    const manuallyRemovedData = getAvailablePasskeysManually(passkeys, passkeyToRemove);

                    return processNewPasskeys(manuallyRemovedData);
                });
        })
        .catch(() => {
            store.dispatch(actions.showInterstice(false));

            return store.dispatch(
                actions.showInfoModal({
                    isOpen: true,
                    title: getText('error'),
                    message: getText('anErrorOccurredPleaseTryAgainLater'),
                    buttonText: getText('ok')
                })
            );
        });
};

const openRemovePasskeysModal = (passkeys, passkeyToRemove, message, userData) =>
    store.dispatch(
        actions.showInfoModal({
            isOpen: true,
            title: getText('removePasskeysTitle'),
            message: message(getText),
            footerColumns: 1,
            buttonText: getText('removePasskey'),
            callback: () => removePasskey(passkeys, passkeyToRemove, userData),
            showCancelButton: true,
            showCloseButton: true
        })
    );

const processNewPasskeys = newPasskeys => {
    const passkeyArray = Object.values(newPasskeys).filter(item => item.passkeyId);
    store.dispatch(updatePasskeys(passkeyArray));

    store.dispatch(actions.showInterstice(false));

    store.dispatch(
        actions.showInfoModal({
            isOpen: true,
            title: getText('passkeyRemoved'),
            message: getText('yourPasskeyHaveBeenRemoved'),
            buttonText: getText('ok')
        })
    );
};

const getPasskeysData = () => {
    return passkeysApi
        .getPasskeys()
        .then(resp => {
            const passkeyArray = Object.values(resp).filter(item => item.passkeyId);
            store.dispatch(updatePasskeys(passkeyArray));

            return passkeyArray;
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);

            return [];
        });
};

const updatePasskeys = data => ({
    type: UPDATE_PASSKEYS,
    payload: data
});

export default {
    getAvailablePasskeysManually,
    openRemovePasskeysModal,
    removePasskey,
    updatePasskeys,
    getPasskeysData
};
