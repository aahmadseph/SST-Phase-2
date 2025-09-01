/* eslint-disable no-shadow */

import ufeApi from 'services/api/ufeApi';
import updateProfile from 'services/api/profile/updateProfile';

import constants from 'services/api/profile/constants';
import RCPSCookies from 'utils/RCPSCookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { EmailSubscriptionTypes, SubscriptionStatus } = constants;

function getNotificationsAndRemindersPreferences(userProfileId) {
    let url = `/api/users/profiles/${userProfileId}?` + 'propertiesToInclude=emailSubscriptionInfo';

    if (RCPSCookies.isRCPSFullProfileGroup()) {
        const selectedStore = Storage.session.getItem(LOCAL_STORAGE.SELECTED_STORE);
        const storeId = selectedStore?.storeId || '';
        const biAccountId = Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.beautyInsiderAccount?.biAccountId || '';
        const { isWoodyCCRewardsEnabled = false } = Sephora.configurationSettings;
        const { enableConciergePickupUS = false } = Sephora.configurationSettings;
        const { enableConciergePickupCA = false } = Sephora.configurationSettings;
        const preferredZipCode = Storage.session.getItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE) || selectedStore?.address?.postalCode;

        url = `/gapi/users/profiles/${userProfileId}?propertiesToInclude=emailSubscriptionInfo&storeId=${storeId}&biAccountId=${biAccountId}&isWoodyCCRewardsEnabled=${isWoodyCCRewardsEnabled}&enableConciergePickupUS=${enableConciergePickupUS}&enableConciergePickupCA=${enableConciergePickupCA}&preferredZipCode=${preferredZipCode}`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => {
        let promise;

        if (data.errorCode) {
            promise = Promise.reject(data);
        } else {
            const subscriptions = data.emailSubscriptionInfo || [];

            const triggeredSubs = subscriptions.filter(data => data.subscriptionType === EmailSubscriptionTypes.TRIGGERED)[0];

            const subscribed = (triggeredSubs && triggeredSubs.subscriptionStatus === SubscriptionStatus.SUBSCRIBED) || false;

            const prefs = { subscribed };

            promise = Promise.resolve(prefs);
        }

        return promise;
    });
}

function setNotificationsAndRemindersPreferences(prefs) {
    return updateProfile({
        fragmentForUpdate: 'EMAIL_SUBSCRIPTION',
        emailSubscriptionInfo: {
            subScribeToEmails: prefs.subscribed,
            subscriptionType: EmailSubscriptionTypes.TRIGGERED
        }
    });
}

export default {
    getNotificationsAndRemindersPreferences,
    setNotificationsAndRemindersPreferences
};
