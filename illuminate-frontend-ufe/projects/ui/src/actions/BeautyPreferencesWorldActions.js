import PageActionCreators from 'actions/framework/PageActionCreators';
import decorators from 'utils/decorators';
import profileApi from 'services/api/profile';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import userActions from 'actions/UserActions';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import biApi from 'services/api/beautyInsider';
import store from 'Store';
import reverseLookUpApi from 'services/api/sdn';
import LanguageLocale from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';

const { normalizeCssHexCode, getValidColorIQEntries } = bpRedesignedUtils;

import { SET_BEAUTY_PREFERENCES_WORLD } from 'constants/actionTypes/beautyPreferencesRedesigned';

class BeautyPreferencesWorldCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => ({});

    openPage = ({ events: { onPageUpdated, onDataLoaded, onError } }) => {
        const action = {
            type: SET_BEAUTY_PREFERENCES_WORLD
        };

        return async dispatch => {
            try {
                // TO DO: Real API call when backend is ready.
                const data = {};

                onDataLoaded(data);
                dispatch(action);
                onPageUpdated(data);
            } catch (error) {
                onError(error);
            }
        };
    };

    //data is {worldKey, refinementKey, refinementItemsKeys}[]
    updateCustomerPreference = (rawData, customerPreference, callback) => async dispatch => {
        try {
            await dispatch(this.updateCustomerPreferenceApi(rawData, customerPreference));
            await dispatch(this.updateCustomerPreferenceLocally(callback));

            if (callback) {
                callback();
            }
        } catch (error) {
            throw error;
        }
    };

    updateCustomerPreferenceApi = (rawData, customerPreference) => async (_, getState) => {
        const storeState = getState();
        const profileId = storeState.user?.profileId;
        let formattedCustomerPreference = {};

        if (!profileId) {
            throw new Error('No Profile Id to update customer preference');
        }

        if (rawData) {
            formattedCustomerPreference = bpRedesignedUtils.addCustomerPreferenceEntries({}, rawData);
        }

        const payload = {
            biAccount: { customerPreference: rawData ? formattedCustomerPreference : customerPreference },
            profileId
        };

        try {
            await decorators.withInterstice(profileApi.updateBeautyPreferences)(payload);
        } catch (error) {
            throw error;
        }
    };

    updateCustomerPreferenceLocally = () => async (dispatch, getState) => {
        const state = getState();
        const profileId = state.user?.profileId;

        if (!profileId) {
            throw new Error('No Profile Id to update customer preference');
        }

        const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, false, false, true);
        const biAccount = await decorators.withInterstice(biApi.getBiProfile)(profileId, true);

        const customerPreference = biAccount.customerPreference;

        if (userData?.data) {
            userData.data.profile.customerPreference = customerPreference || {};
            Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userData.data, userData.expiry);
        }

        dispatch(userActions.update({ customerPreference }, false));

        return;
    };

    // Simple Color IQ save action for BP World
    saveColorIQ = (colorIQData, callback) => async dispatch => {
        const state = store.getState();
        const profileId = state.user?.profileId;

        if (!profileId) {
            Sephora.logger.error('No Profile Id to save Color IQ');

            if (callback) {
                callback();
            }

            return;
        }

        try {
            // Transform new Color IQ data to API format
            const transformedNewColorIQ = Array.isArray(colorIQData) ? colorIQData : [colorIQData];
            const newApiPayload = transformedNewColorIQ.map(item => ({
                value: item.shadeCode || item.shadeDesc || '',
                channel: item.channel || '442',
                labValue: item.labValue || '',
                hexValue: item.hexCode || '',
                storeNumber: item.storeNumber || '700'
            }));

            // Call the API to save Color IQ using the same biAccount structure as BeautyPreferencesActions
            const data = {
                biAccount: {
                    colorIq: newApiPayload // Only send new entries
                },
                profileId
            };

            await decorators.withInterstice(profileApi.updateBeautyPreferences)(data);

            // Update local storage and Redux store
            const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, false, false, true);
            const biAccount = await decorators.withInterstice(biApi.getBiProfile)(profileId, true);
            const colorIQ = biAccount.colorIq || biAccount.colorIQ || [];
            let finalColorIQ = colorIQ;

            if (colorIQ.length === 0 && transformedNewColorIQ.length > 0) {
                // Get existing Color IQ data from current state to append to
                const currentStateUpdated = store.getState();
                const existingColorIQUpdated = currentStateUpdated.user?.colorIQ || currentStateUpdated.user?.colorIq || [];

                // Create new Color IQ entries with proper date format
                const formattedDate = dateUtils.getCurrentDateInMDYYYYFormat();

                const newColorIQEntries = transformedNewColorIQ.map(item => ({
                    ...item,
                    isRecent: 'Y',
                    createDate: formattedDate,
                    creationDate: formattedDate
                }));

                // Prepend new entries to existing ones - newest first
                finalColorIQ = [...newColorIQEntries, ...existingColorIQUpdated];
            } else if (colorIQ.length > 0) {
                // API returned data but we need to enrich it with missing fields from original data
                finalColorIQ = colorIQ.map((apiEntry, index) => {
                    // Find matching entry from our original transformed data
                    const originalEntry =
                        transformedNewColorIQ.find(item => item.labValue === apiEntry.labValue || index < transformedNewColorIQ.length) ||
                        transformedNewColorIQ[index] ||
                        {};

                    return {
                        ...apiEntry,
                        shadeCode: originalEntry.shadeCode || apiEntry.value,
                        shadeDesc: originalEntry.shadeDesc || apiEntry.value,
                        hexCode: originalEntry.hexCode || apiEntry.hexValue,
                        hexValue: originalEntry.hexCode || apiEntry.hexValue,
                        cssColor: originalEntry.cssColor,
                        // Preserve the API's isRecent value, or set to 'Y' for new entries
                        isRecent: apiEntry.isRecent || 'Y',
                        // Keep the API's creation date if it exists, otherwise use current date
                        createDate: apiEntry.createDate || apiEntry.creationDate || dateUtils.getCurrentDateInMDYYYYFormat(),
                        creationDate: apiEntry.createDate || apiEntry.creationDate || dateUtils.getCurrentDateInMDYYYYFormat()
                    };
                });
            }

            if (userData?.data) {
                userData.data.profile.colorIQ = finalColorIQ;
                userData.data.profile.colorIq = finalColorIQ;
                Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userData.data, userData.expiry);
            }

            dispatch(userActions.update({ colorIQ: finalColorIQ }, false));

            // Fetch lab descriptions for enriched data
            if (finalColorIQ.length > 0) {
                dispatch(this.fetchColorIQLabDescriptions(finalColorIQ));
            }

            if (callback) {
                callback();
            }
        } catch (error) {
            Sephora.logger.error('Error saving Color IQ:', error);

            if (callback) {
                callback();
            }
        }
    };

    // Fetch lab descriptions for Color IQ data
    fetchColorIQLabDescriptions = colorIQData => dispatch => {
        const allColorIQ = Array.isArray(colorIQData) ? colorIQData : [];
        const colorIQList = getValidColorIQEntries(colorIQData);
        const languageOpt = LanguageLocale.isFrench() ? 'fr' : 'en';

        if (colorIQList.length === 0) {
            // No valid entries for lab lookup, preserve original data
            dispatch(userActions.update({ colorIQ: allColorIQ }, false));

            return Promise.resolve();
        }

        return Promise.allSettled(colorIQList.map(lab => reverseLookUpApi.getLABCodeDescription(lab.labValue.replace(/,/g, ':'))))
            .then(descriptions => {
                const enrichedMap = new Map();

                descriptions.forEach(({ status, value }, index) => {
                    if (status === 'fulfilled') {
                        const { depth, intensity, undertone, hex } = value;
                        const validEntry = colorIQList[index];

                        // Find the actual original entry from allColorIQ that matches this labValue
                        const originalEntry = allColorIQ.find(entry => entry.labValue === validEntry.labValue) || validEntry;

                        // Handle different date field names
                        const rawDate = originalEntry.createDate || originalEntry.creationDate;
                        let formattedDate = rawDate;

                        if (rawDate) {
                            try {
                                const dateObj = new Date(rawDate);

                                if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
                                    formattedDate = new Intl.DateTimeFormat('en-US').format(dateObj);
                                }
                            } catch (e) {
                                Sephora.logger.error('Error formatting date:', e, 'for entry:', originalEntry);
                            }
                        }

                        const enrichedEntry = {
                            ...originalEntry, // Preserve all original fields including isRecent
                            createDate: formattedDate,
                            creationDate: formattedDate, // Support both field names
                            description: `${depth[languageOpt]} • ${undertone[languageOpt]} • ${intensity[languageOpt]}`,
                            hexCode: normalizeCssHexCode(originalEntry.cssColor || hex || originalEntry.hexValue),
                            hexValue: normalizeCssHexCode(originalEntry.cssColor || hex || originalEntry.hexValue), // Support both field names
                            // Explicitly preserve the isRecent field from the original entry
                            isRecent: originalEntry.isRecent
                        };

                        enrichedMap.set(originalEntry.labValue, enrichedEntry);
                    }
                });

                // Merge enriched data back with all original entries
                const finalColorIQ = allColorIQ.map(entry => {
                    if (entry.labValue && enrichedMap.has(entry.labValue)) {
                        return enrichedMap.get(entry.labValue);
                    }

                    return entry;
                });

                // Update Redux with merged Color IQ data (enriched + original)
                dispatch(userActions.update({ colorIQ: finalColorIQ }, false));
            })
            .catch(error => {
                Sephora.logger.verbose('Error fetching Color IQ lab descriptions:', error);
                // On error, preserve the original data
                dispatch(userActions.update({ colorIQ: allColorIQ }, false));
            });
    };
}

const BeautyPreferencesWorldActions = new BeautyPreferencesWorldCreators();

export default BeautyPreferencesWorldActions;
