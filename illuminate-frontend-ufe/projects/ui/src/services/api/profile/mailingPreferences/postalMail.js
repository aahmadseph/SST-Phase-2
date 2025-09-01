/* eslint-disable no-shadow */

import ufeApi from 'services/api/ufeApi';
import updateProfile from 'services/api/profile/updateProfile';

import constants from 'services/api/profile/constants';
import RCPSCookies from 'utils/RCPSCookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import accessTokenApi from 'services/api/accessToken/accessToken';

const { EmailSubscriptionTypes, SubscriptionStatus } = constants;
const accessToken = 'AUTH_ACCESS_TOKEN';

function getPostalMailPreferences(jwtAccessToken, userProfileId) {
    const urlParams =
        'propertiesToSkip=' +
        'personalizedInformation,' +
        'subcriptions,' +
        'subsriptionPrograms,' +
        'personalizedInformation&' +
        'propertiesToInclude=' +
        'catalogAddress,emailSubscriptionInfo';

    let url = `/api/users/profiles/${userProfileId}?` + urlParams;

    if (RCPSCookies.isRCPSFullProfileGroup()) {
        const selectedStore = Storage.session.getItem(LOCAL_STORAGE.SELECTED_STORE);
        const storeId = selectedStore?.storeId || '';
        const biAccountId = Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.beautyInsiderAccount?.biAccountId || '';
        const { isWoodyCCRewardsEnabled = false } = Sephora.configurationSettings;
        const { enableConciergePickupUS = false } = Sephora.configurationSettings;
        const { enableConciergePickupCA = false } = Sephora.configurationSettings;
        const preferredZipCode = Storage.session.getItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE) || selectedStore?.address?.postalCode;

        url = `/gapi/users/profiles/${userProfileId}?${urlParams}&storeId=${storeId}&biAccountId=${biAccountId}&isWoodyCCRewardsEnabled=${isWoodyCCRewardsEnabled}&enableConciergePickupUS=${enableConciergePickupUS}&enableConciergePickupCA=${enableConciergePickupCA}&preferredZipCode=${preferredZipCode}`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => {
        let promise;

        if (data.errorCode) {
            promise = Promise.reject(data);
        } else {
            const catalogAddress = data.catalogAddress;
            const emailSubscriptionInfo = data.emailSubscriptionInfo;
            let mailSubscription;
            let subscribed = false;
            let prefs;

            // Data from POSTAL mail subscription is included in
            // emailSubscriptionInfo object
            if (emailSubscriptionInfo) {
                mailSubscription = emailSubscriptionInfo.filter(obj => obj.subscriptionType === EmailSubscriptionTypes.MAIL);

                // Check if user is subscribed to postal mail
                if (mailSubscription && mailSubscription.length > 0) {
                    subscribed = mailSubscription[0].subscriptionStatus === SubscriptionStatus.SUBSCRIBED;
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

            promise = Promise.resolve(prefs);
        }

        return promise;
    });
}

function setPostalMailPreferences(prefs) {
    const data = {
        fragmentForUpdate: 'CATALOG_ADDRESS',
        catalogAddress: { subscribe: prefs.subscribed }
    };

    if (prefs.subscribed) {
        data.catalogAddress.address = prefs.address;
    }

    return updateProfile(data);
}

export default {
    getPostalMailPreferences: accessTokenApi.withAccessToken(getPostalMailPreferences, accessToken),
    setPostalMailPreferences
};
