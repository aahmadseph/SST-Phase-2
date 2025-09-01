import {
    getPreferences,
    fetchPromotionalEmailPreferences,
    fetchNotificationsAndRemindersPreferences,
    fetchPostalMailPreferences
} from 'services/api/profile/mailingPreferences/common/getPreferences';
import { FETCH_PREFERENCES_SUCCESS } from 'constants/actionTypes/mailingPrefs';
import profileIdSelector from 'selectors/user/profileIdSelector';
import cookieUtils from 'utils/Cookies';

// Action creators
const fetchPreferencesSuccess = preferences => ({ type: FETCH_PREFERENCES_SUCCESS, payload: preferences });

// eslint-disable-next-line consistent-return
export const fetchAndStorePreferences = () => async (dispatch, getState) => {
    try {
        const reduxState = getState();
        const userProfileId = profileIdSelector(reduxState);
        const urlParams = 'propertiesToSkip=subscriptions,subscriptionPrograms,&propertiesToInclude=catalogAddress,emailSubscriptionInfo';
        const preferences = await getPreferences(userProfileId, urlParams, data => data);

        // Each method below utilizes the same response from getPreferences() but processes the data in a unique way.
        // Therefore, each method is called to process and return the data in the format required by each corresponding component
        // for future use without repeating the api call "N" times.
        const notificationsAndReminders = fetchNotificationsAndRemindersPreferences(preferences);
        const postalMail = fetchPostalMailPreferences(preferences);
        const promotionalEmail = fetchPromotionalEmailPreferences(preferences);

        if (preferences?.preferredStore && Sephora.configurationSettings.setZipStoreCookie) {
            cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE, preferences.preferredStore, null, false, false);
        }

        // Store this data in the redux store to later be pulled and passed to each component
        return dispatch(
            fetchPreferencesSuccess({
                mailingPreferences: {
                    notificationsAndReminders,
                    postalMail,
                    promotionalEmail
                }
            })
        );
    } catch (error) {
        Sephora.logger.error('[FetchAndStorePreferences Error]:', error);

        return Promise.reject(error, 'Error fetching and storing preferences');
    }
};
