import biApi from 'services/api/beautyInsider';
import profileApi from 'services/api/profile';
import beautyPreferencesApi from 'services/api/beautyPreferences';
import reverseLookUpApi from 'services/api/sdn';

import actions from 'Actions';
import store from 'store/Store';
import ProfileActions from 'actions/ProfileActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import beautyPreferencesBindings from 'analytics/bindingMethods/pages/beautyPreferences/BeautyPreferencesBindings';

import {
    SET_COLOR_IQ,
    SET_INITIAL_BEAUTY_PREFERENCES,
    SET_MULTIPLE_BEAUTY_PREFERENCES,
    SET_UPDATED_BEAUTY_PREFERENCES_MULTIPLE,
    SET_EXPANDED_PREFERENCE,
    SET_PROFILE_COMPLETION_PERCENTAGE,
    SET_MAPPED_BRANDS_LIST,
    SET_IS_COLORIQ_LAST_ANSWERED_TRAIT,
    SET_FILTERED_OUT_USER_FAV_BRAND_IDS
} from 'constants/actionTypes/beautyPreferences';
import { PREFERENCE_TYPES, profileCategories, COLORIQ_BP_PAGE_COMPONENT_NAME } from 'constants/beautyPreferences';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';
import LanguageLocale from 'utils/LanguageLocale';

const { isFrench } = LanguageLocale;

const {
    calculateProfileCompletionStatus, mapFetchedBrandsList, getValidColorIQEntries, normalizeCssHexCode, filterOutUserFavBrandsBPpageIDs
} =
    BeautyPreferencesUtils;

const { getGroupedBrandsList } = beautyPreferencesApi;

function setColorIQ(colorIQ) {
    return {
        type: SET_COLOR_IQ,
        payload: { colorIQ }
    };
}

function setInitialBeautyPreferences(initialData) {
    return {
        type: SET_INITIAL_BEAUTY_PREFERENCES,
        initialData
    };
}

function setMultipleBeautyPreferences(category, selectedProfiles) {
    return {
        type: SET_MULTIPLE_BEAUTY_PREFERENCES,
        category,
        selectedProfiles
    };
}

function setUpdatedBeautyPreferences(data) {
    return {
        type: SET_UPDATED_BEAUTY_PREFERENCES_MULTIPLE,
        data
    };
}

function setExpandedPreference(expandedPreference) {
    return {
        type: SET_EXPANDED_PREFERENCE,
        expandedPreference
    };
}

function setProfileCompletionPercentage(beautyPreferences) {
    const profileCompletionPercentage = calculateProfileCompletionStatus(beautyPreferences);

    return {
        type: SET_PROFILE_COMPLETION_PERCENTAGE,
        profileCompletionPercentage
    };
}

function updateBeautyPreferences(
    category = null,
    profileId,
    profileData,
    beautyPreferences = {},
    successCallback,
    errorTitle = '',
    errorMessage = '',
    errorButtonText = '',
    errorCallback = null
) {
    let personalizedInformation = {};
    let updatedBeautyPreferences = {};
    const isColorIQCategory = category?.type === PREFERENCE_TYPES.COLOR_IQ;

    if (category) {
        const colorIQForAPI = profileData;
        const colorIQForLS = [profileData, ...(beautyPreferences[PREFERENCE_TYPES.COLOR_IQ] ? beautyPreferences[PREFERENCE_TYPES.COLOR_IQ] : [])];

        updatedBeautyPreferences = {
            ...beautyPreferences,
            ...(!isColorIQCategory && { [category.type]: profileData }),
            ...(isColorIQCategory && { [category.type]: colorIQForLS })
        };

        personalizedInformation = updatedBeautyPreferences;

        // the API accepts colorIQ category as an object
        if (isColorIQCategory) {
            personalizedInformation[PREFERENCE_TYPES.COLOR_IQ] = colorIQForAPI;
        }

        // if there are no changes in colorIQ category we send nothing as the payload
        if (!isColorIQCategory && personalizedInformation[PREFERENCE_TYPES.COLOR_IQ]) {
            personalizedInformation[PREFERENCE_TYPES.COLOR_IQ] = {};
        }
    } else {
        updatedBeautyPreferences = Object.keys(profileData).reduce((acc, trait) => {
            const traits = profileData[trait].map(item => item.key);
            acc[trait] = [...beautyPreferences[trait], ...traits];

            return acc;
        }, {});

        // Don't need to pass colorIQ when saving from Cat/Guided Selling
        personalizedInformation = { ...beautyPreferences, ...updatedBeautyPreferences, colorIQ: null };
    }

    const { colorIQ, ...userBeautyPreference } = personalizedInformation;
    const hasColorIQ = colorIQ && !!Object.keys(colorIQ).length;
    const colorIQValuesToSave = hasColorIQ && Array.isArray(colorIQ) ? colorIQ : [colorIQ];

    const data = {
        biAccount: {
            userBeautyPreference,
            colorIq: hasColorIQ ? colorIQValuesToSave : undefined
        },
        profileId
    };

    return dispatch =>
        profileApi
            .updateBeautyPreferences(data)
            .then(response => {
                if (response.responseStatus === 200) {
                    dispatch(
                        biApi
                            .getBiProfile(profileId, true)
                            .then(res => {
                                const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, false, false, true);

                                if (userData?.data?.beautyPreference) {
                                    userData.data.beautyPreference = updatedBeautyPreferences;
                                    userData.data.profile.userBeautyPreference = userBeautyPreference;
                                    Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userData.data, userData.expiry);
                                }

                                if (category) {
                                    dispatch(setMultipleBeautyPreferences(category.type, isColorIQCategory ? res.colorIq ?? [] : profileData));
                                    successCallback && successCallback();
                                } else {
                                    successCallback &&
                                        successCallback(() => {
                                            dispatch(setUpdatedBeautyPreferences(updatedBeautyPreferences));
                                        });
                                }

                                dispatch(setProfileCompletionPercentage(updatedBeautyPreferences));
                            })
                            .catch(() => errorCallback && errorCallback())
                    );
                }
            })
            .catch(error => {
                if (error instanceof TypeError && error.message.includes('Network')) {
                    const closeAPIErrorModal = () => dispatch(actions.showInfoModal({ isOpen: false }));

                    dispatch(
                        actions.showInfoModal({
                            isOpen: true,
                            title: errorTitle,
                            message: errorMessage,
                            buttonText: errorButtonText,
                            callback: errorCallback ? errorCallback : closeAPIErrorModal,
                            showCancelButton: false,
                            footerColumns: 1,
                            buttonWidth: [164, 126],
                            footerDisplay: 'flex',
                            footerJustifyContent: 'flex-end',
                            bodyFooterPaddingX: 4,
                            isHtml: false,
                            cancelCallback: closeAPIErrorModal
                        })
                    );
                }

                if (error && error?.errorCode) {
                    errorCallback && errorCallback();
                }
            });
}

function skipThisQuestionClick({ accordionName }) {
    beautyPreferencesBindings.skipQuestion({ accordionName });
}

function signInToSaveClick() {
    beautyPreferencesBindings.signInToSave();
}

function saveAndContinueClick({ beautyPreferences, selectedAccordionName, selectedAccordionValue, saveOnly }) {
    const completionPercentage = calculateProfileCompletionStatus(beautyPreferences);
    beautyPreferencesBindings.saveAndContinue({
        completionPercentage,
        selectedAccordionName,
        beautyPreferences,
        selectedAccordionValue,
        saveOnly
    });
}

function fireAnalytics(type, isLastPref, isAccordionClick, buttonType, nextCatType) {
    const { BEAUTY_PREFERENCES, MY_SEPHORA } = anaConsts.PAGE_NAMES;
    const actionInfo = {
        skipButton: `${MY_SEPHORA}:skip:${type}`,
        saveButton: isAccordionClick ? '' : `${MY_SEPHORA}:${isLastPref ? 'save' : 'save&continue'}:${type}`
    };

    const processType = isAccordionClick ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT;
    const categoryName = profileCategories.find(item => item.type === nextCatType)?.name;
    const pageDetail = isAccordionClick || nextCatType ? 'accordion' : BEAUTY_PREFERENCES;

    const data = {
        pageName: `${MY_SEPHORA}:accordion:${nextCatType ? categoryName : type}:*`,
        actionInfo: actionInfo[buttonType],
        linkName: 'D=c55',
        pageDetail,
        world: nextCatType ? categoryName : type
    };

    if (buttonType && !isAccordionClick) {
        const pageName = `${MY_SEPHORA}:accordion:${type}:*`;
        digitalData.page.attributes.previousPageData.linkData = actionInfo[buttonType];
        digitalData.page.attributes.sephoraPageInfo.pageName = pageName;

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data
        });
    }

    if (isAccordionClick) {
        return processEvent.process(processType, {
            data: {
                ...data,
                pageName: `${MY_SEPHORA}:accordion:${type}:*`,
                world: type
            }
        });
    } else {
        return null;
    }
}

function fireAnalyticsDataOverwrites(overwrites = {}, isPageLoad = false) {
    // with isPageLoad=true fires s.t call and isPageLoad=false fires s.tl call
    const processType = isPageLoad ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT;

    return processEvent.process(processType, {
        data: overwrites
    });
}

const openShadeFinderModal = () => actions.showWizard(true, undefined, COLORIQ_BP_PAGE_COMPONENT_NAME);

const openRegisterBIModal = (callback = null) => actions.showBiRegisterModal({ isOpen: true, callback, cancellationCallback: callback });

const openPrivacySettingsModal = (title, beautyPrefs, socialProfile, saveProfileCallback) =>
    ProfileActions.showEditFlowModal(true, title, 2, beautyPrefs, socialProfile, saveProfileCallback);

const closePrivacySettingsModal = (profileData, callback) => {
    store.dispatch(ProfileActions.updateBiAccount(profileData.biPrivate, callback));
};

function setMappedBrandsList(brandsList) {
    const mappedBrandsList = mapFetchedBrandsList(brandsList);

    return {
        type: SET_MAPPED_BRANDS_LIST,
        payload: { mappedBrandsList }
    };
}

function fetchGroupedBrandsList() {
    return dispatch =>
        getGroupedBrandsList()
            .then(data => (data.groupedBrands ? dispatch(setMappedBrandsList(data.groupedBrands)) : null))
            .catch(() => {});
}

function fetchColorIQLabDescriptions(beautyPreferences = {}) {
    const colorIQList = getValidColorIQEntries(beautyPreferences);
    const languageOpt = isFrench() ? 'fr' : 'en';

    return dispatch =>
        Promise.allSettled(colorIQList.map(lab => reverseLookUpApi.getLABCodeDescription(lab.labValue.replace(/,/g, ':'))))
            .then(descriptions => {
                const colorIQItems = descriptions
                    .filter(({ status }) => status === 'fulfilled')
                    .map(({ value: { depth, intensity, undertone, hex } }, index) => {
                        const {
                            createDate, labValue, shadeCode, storeName, cssColor
                        } = colorIQList[index];

                        let formattedDate = new Date(createDate);

                        if (formattedDate instanceof Date && !isNaN(formattedDate)) {
                            formattedDate = new Intl.DateTimeFormat('en-GB').format(formattedDate);
                        } else {
                            formattedDate = '';
                        }

                        return {
                            createDate: formattedDate,
                            description: `${depth[languageOpt]} • ${undertone[languageOpt]} • ${intensity[languageOpt]}`,
                            hexCode: normalizeCssHexCode(cssColor || hex),
                            labValue,
                            storeName,
                            shadeCode
                        };
                    });

                dispatch(setColorIQ(colorIQItems));
            })
            .catch(() => dispatch(setColorIQ([])));
}

function setIsColorIQLastAnsweredTrait(isLastPref) {
    return {
        type: SET_IS_COLORIQ_LAST_ANSWERED_TRAIT,
        payload: isLastPref
    };
}

function setFilteredOutUserFavoriteBrandIDs(beautyPreferences, brandNames) {
    return {
        type: SET_FILTERED_OUT_USER_FAV_BRAND_IDS,
        payload: {
            favoriteBrands: filterOutUserFavBrandsBPpageIDs(beautyPreferences, brandNames)
        }
    };
}

export default {
    updateBeautyPreferences,
    setMultipleBeautyPreferences,
    signInToSaveClick,
    skipThisQuestionClick,
    saveAndContinueClick,
    fireAnalytics,
    fireAnalyticsDataOverwrites,
    openShadeFinderModal,
    setExpandedPreference,
    setInitialBeautyPreferences,
    openRegisterBIModal,
    openPrivacySettingsModal,
    closePrivacySettingsModal,
    setProfileCompletionPercentage,
    fetchGroupedBrandsList,
    fetchColorIQLabDescriptions,
    setIsColorIQLastAnsweredTrait,
    setFilteredOutUserFavoriteBrandIDs,
    setUpdatedBeautyPreferences
};
