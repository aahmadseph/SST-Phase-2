import RCPSCookies from 'utils/RCPSCookies';
import ufeApi from 'services/api/ufeApi';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import constants from 'services/api/profile/constants';
import accessTokenApi from 'services/api/accessToken/accessToken';

const { PROMOTIONAL_EMAILS_PREFS_COUNTRIES, PromotionalEmailsPrefsFrequency, EmailSubscriptionTypes, SubscriptionStatus } = constants;
const accessToken = 'AUTH_ACCESS_TOKEN';

// eslint-disable-next-line consistent-return
/**
 *
 * @param {*} userProfileId
 * @param {*} urlParams
 * @param {*} processResponse
 * @returns
 */
async function getPreferencesCall(_jwtAccessToken, userProfileId = null, urlParams, processResponse) {
    try {
        // Handle case where state isn't available yet
        if (!userProfileId) {
            // eslint-disable-next-line no-param-reassign
            userProfileId = Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.profileId || Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID);
        }

        let url = `/api/users/profiles/${userProfileId}?` + urlParams;

        if (RCPSCookies.isRCPSFullProfileGroup()) {
            const storeId =
                Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.preferredStore ||
                Storage.local.getItem(LOCAL_STORAGE.SELECTED_STORE)?.storeId;
            const biAccountId =
                Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.beautyInsiderAccount?.biAccountId ||
                Storage.local.getItem(LOCAL_STORAGE.BI_ACCOUNT_ID);
            const preferredZipCode = Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.preferredZipCode;

            url = `/gapi/users/profiles/${userProfileId}?${urlParams}`;

            // Append these if they exist
            if (storeId) {
                url += `&storeId=${storeId}`;
            }

            if (biAccountId) {
                url += `&biAccountId=${biAccountId}`;
            }

            if (preferredZipCode) {
                url += `&preferredZipCode=${preferredZipCode}`;
            }
        }

        const data = await ufeApi.makeRequest(url, { method: 'GET' });

        if (data.errorCode || data.err) {
            throw data;
        }

        return processResponse(data);
    } catch (error) {
        Sephora.logger.verbose('[Error from getPreferences() call]: ', error);
        throw new Error(error);
    }
}

export const getPreferences = accessTokenApi.withAccessToken(getPreferencesCall, accessToken);

/**
 *
 * @param {*} data
 * @returns
 */
export const fetchPromotionalEmailPreferences = data => {
    const subscriptions = data.emailSubscriptionInfo || [];
    const consumerSubs = subscriptions.find(subsData => subsData.subscriptionType === EmailSubscriptionTypes.CONSUMER);

    return {
        subscribed: (consumerSubs && consumerSubs.subscriptionStatus === SubscriptionStatus.SUBSCRIBED) || false,
        frequency: (consumerSubs && consumerSubs.subscriptionFrequency) || PromotionalEmailsPrefsFrequency.DAILY,
        country: (consumerSubs && consumerSubs.countryLocation) || PROMOTIONAL_EMAILS_PREFS_COUNTRIES[0][0],
        zipPostalCode: (consumerSubs && consumerSubs.subscriptionZip) || null
    };
};

/**
 *
 * @param {*} data
 * @returns
 */
export const fetchNotificationsAndRemindersPreferences = data => {
    const subscriptions = data.emailSubscriptionInfo || [];
    const triggeredSubs = subscriptions.find(subsData => subsData.subscriptionType === EmailSubscriptionTypes.TRIGGERED);

    return {
        subscribed: (triggeredSubs && triggeredSubs.subscriptionStatus === SubscriptionStatus.SUBSCRIBED) || false
    };
};

/**
 *
 * @param {*} data
 * @returns
 */
export const fetchPostalMailPreferences = data => {
    const catalogAddress = data.catalogAddress;
    const emailSubscriptionInfo = data.emailSubscriptionInfo;
    let mailSubscription;
    let subscribed = false;
    let prefs;

    if (emailSubscriptionInfo) {
        mailSubscription = emailSubscriptionInfo.find(obj => obj.subscriptionType === EmailSubscriptionTypes.MAIL);

        if (mailSubscription) {
            subscribed = mailSubscription.subscriptionStatus === SubscriptionStatus.SUBSCRIBED;
        }
    }

    if (!catalogAddress) {
        prefs = {
            subscribed,
            address: {}
        };
    } else if (
        catalogAddress.firstName &&
        catalogAddress.lastName &&
        catalogAddress.isDefault === false &&
        Object.keys(catalogAddress).length === 3
    ) {
        prefs = {
            subscribed,
            address: {
                firstName: catalogAddress.firstName,
                lastName: catalogAddress.lastName
            }
        };
    } else {
        prefs = {
            subscribed,
            address: {
                firstName: catalogAddress.firstName,
                lastName: catalogAddress.lastName,
                country: catalogAddress.country,
                city: catalogAddress.city,
                state: catalogAddress.state,
                address1: catalogAddress.address1,
                address2: catalogAddress.address2,
                postalCode: catalogAddress.postalCode
            }
        };
    }

    return prefs;
};
