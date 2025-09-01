/* eslint-disable no-shadow */

import ufeApi from 'services/api/ufeApi';
import updateProfile from 'services/api/profile/updateProfile';

import constants from 'services/api/profile/constants';
import RCPSCookies from 'utils/RCPSCookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import accessTokenApi from 'services/api/accessToken/accessToken';

const { PROMOTIONAL_EMAILS_PREFS_COUNTRIES, PromotionalEmailsPrefsFrequency, EmailSubscriptionTypes, SubscriptionStatus } = constants;
const accessToken = 'AUTH_ACCESS_TOKEN';

function getPromotionalEmailPreferences(jwtAccessToken, userProfileId) {
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

            const consumerSubs = subscriptions.filter(data => data.subscriptionType === EmailSubscriptionTypes.CONSUMER)[0];

            const emailPrefs = {
                subscribed: (consumerSubs && consumerSubs.subscriptionStatus === SubscriptionStatus.SUBSCRIBED) || false,
                frequency: (consumerSubs && consumerSubs.subscriptionFrequency) || PromotionalEmailsPrefsFrequency.DAILY,
                country: (consumerSubs && consumerSubs.countryLocation) || PROMOTIONAL_EMAILS_PREFS_COUNTRIES[0][0],
                zipPostalCode: (consumerSubs && consumerSubs.subscriptionZip) || null
            };

            promise = Promise.resolve(emailPrefs);
        }

        return promise;
    });
}

function setPromotionalEmailPreferences(userProfileId, prefs) {
    return updateProfile({
        fragmentForUpdate: 'EMAIL_SUBSCRIPTION',
        emailSubscriptionInfo: {
            subScribeToEmails: prefs.subscribed,
            subscriptionType: EmailSubscriptionTypes.CONSUMER,
            countryLocation: prefs.country,
            subscriptionFrequency: prefs.frequency,
            zipCode: prefs.zipPostalCode
        }
    });
}

export default {
    getPromotionalEmailPreferences: accessTokenApi.withAccessToken(getPromotionalEmailPreferences, accessToken),
    setPromotionalEmailPreferences
};
