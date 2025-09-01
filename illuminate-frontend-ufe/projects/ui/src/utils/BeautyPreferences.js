import * as beautyPreferenceConstants from 'constants/beautyPreferences';
import Empty from 'constants/empty';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import store from 'Store';
import languageLocaleUtils from 'utils/LanguageLocale';

const {
    noPreferenceOptions,
    notSureOption,
    noPreferenceFavoriteBrands,
    profileCategories,
    PREFERENCE_TYPES,
    TOTAL_PREFERENCES,
    PROGRESS_BAR_EXCLUDED_ATTRIBUTES,
    CAROUSEL_ONE_TRAITS,
    PROGRESS_BAR_UPDATE_MESSAGE_ATTRIBUTES,
    CAROUSEL_REQUIRED_TRAITS
} = beautyPreferenceConstants;

function getLocalStorageMasterList() {
    return Storage.local.getItem(LOCAL_STORAGE.REFINEMENTS) || {};
}

function getMasterListRefinementsByCategory(categoryId) {
    const masterList = getLocalStorageMasterList();
    const masterListRefinements = masterList.refinements || [];

    return masterListRefinements.find(category => category.categoryId === categoryId)?.refinements || [];
}

function getAllMasterListUniqueRefinements(onlyVisibleBPItems = false) {
    const masterList = getLocalStorageMasterList();
    const masterListRefinements = masterList.refinements;
    const user = store.getState().user;
    const userBeautyPreference = user.userBeautyPreference || {};

    if (!Array.isArray(masterListRefinements)) {
        return [];
    }

    const refinementMap = new Map();

    masterListRefinements.forEach(category => {
        if (!category || !Array.isArray(category.refinements)) {
            return;
        }

        category.refinements.forEach(refinement => {
            if (!refinement || !refinement.key) {
                return;
            }

            //Make Unique Refinements
            const savedRefinement = refinementMap.get(refinement.key) || { ...refinement, items: new Map(), worldKey: category.key };

            (refinement.items || []).forEach(item => {
                const isValidItem = item && item.key;
                const isVisible = onlyVisibleBPItems ? item.visableInBP : true;

                //Make Unique Items
                if (isValidItem && isVisible) {
                    const beautyPreferenceValues = userBeautyPreference[refinement.key];
                    const isItemSelectedAsUserBeautyPreference =
                        beautyPreferenceValues && beautyPreferenceValues instanceof Array && beautyPreferenceValues?.includes(item.key);
                    savedRefinement.items.set(item.key, { ...item, isItemSelectedAsUserBeautyPreference });
                }
            });

            refinementMap.set(refinement.key, savedRefinement); // Store back after modification
        });
    });

    // Convert Refinements and Items map back to arrays
    return Array.from(refinementMap.values()).map(refinement => ({
        ...refinement,
        items: Array.from(refinement.items.values())
    }));
}

function getDynamicRefinements() {
    const staticRefinements = [...profileCategories];
    const masterListRefinements = getAllMasterListUniqueRefinements(true);
    const dynamicRefinements = staticRefinements.map(staticRefinement => {
        const foundMasterListRefinement = masterListRefinements.find(masterListRefinement => masterListRefinement.key === staticRefinement.type);

        if (foundMasterListRefinement && foundMasterListRefinement.value) {
            return {
                ...staticRefinement,
                ...foundMasterListRefinement
            };
        }

        return staticRefinement;
    });

    const favoriteBrandsItems = {
        key: 'noPreferenceFB',
        value: languageLocaleUtils.isFRCanada() ? 'Aucune préférence' : 'No Preference',
        visableInBP: true,
        filterable: false
    };

    // Have to add this manually to the refinements since it's not provided in the master list
    const updatedDynamicRefinements = dynamicRefinements.map(refinement => {
        if (refinement.type === 'favoriteBrands') {
            refinement.items = [favoriteBrandsItems];

            return refinement;
        }

        return refinement;
    });

    return updatedDynamicRefinements;
}

function getUserBeautyPreferencesWithFullValues() {
    const info = {};
    const refinements = getDynamicRefinements() || [];
    refinements.forEach(refinement => {
        const selectedItems = [];
        refinement.items?.forEach(item => {
            if (item.isItemSelectedAsUserBeautyPreference) {
                selectedItems.push(item);
            }
        });

        if (selectedItems.length) {
            info[refinement.key] = selectedItems;
        }
    });

    return info;
}

function isAllAnswered(beautyPreferences = {}, excluding = []) {
    if (excluding instanceof Array && excluding.length) {
        return Object.keys(beautyPreferences)
            .filter(x => !excluding.includes(x))
            .every(e => beautyPreferences[e].length);
    }

    return Object.values(beautyPreferences).every(e => e.length);
}

function isAtLeastOneAnswered(beautyPreferences = {}) {
    return Object.values(beautyPreferences).some(e => e.length);
}

function initialUnansweredPref(beautyPreferences = {}) {
    const unansweredPrefs = Object.keys(beautyPreferences).filter(key => beautyPreferences[key]?.length < 1);
    const profileCatArray = profileCategories.map(a => a.type);

    return unansweredPrefs.sort((a, b) => profileCatArray.indexOf(a) - profileCatArray.indexOf(b))[0];
}

function allUnansweredPrefs(beautyPreferences = {}) {
    const unansweredPrefs = Object.keys(beautyPreferences).filter(key => beautyPreferences[key]?.length < 1);
    const profileCatsArray = profileCategories.map(a => a.type);

    return unansweredPrefs.sort((a, b) => profileCatsArray.indexOf(a) - profileCatsArray.indexOf(b));
}

function calculateProfileCompletionStatus(beautyPreferences = {}) {
    const currentSelectionStatus = Object.keys(beautyPreferences).filter(
        x => beautyPreferences[x]?.length > 0 && PROGRESS_BAR_EXCLUDED_ATTRIBUTES.indexOf(x) === -1
    ).length;

    return Math.ceil((currentSelectionStatus / TOTAL_PREFERENCES) * 100);
}

function getNextUnansweredQuestion(currIndex, refinements, isAllAnsweredPrefs, allUnansweredPrefsArr) {
    if (isAllAnsweredPrefs || allUnansweredPrefsArr.length === 1) {
        return allUnansweredPrefsArr[0];
    }

    const reorderedRefinements = refinements.slice(currIndex + 1).concat(refinements.slice(0, currIndex));
    const nextUnansweredQuesValue = reorderedRefinements.find(refinement => allUnansweredPrefsArr.indexOf(refinement.type) > -1);

    return nextUnansweredQuesValue?.type;
}

function isLastUnansweredIndex(categoryType, isAllAnsweredPrefs, allUnansweredPrefsArr) {
    return isAllAnsweredPrefs ? false : allUnansweredPrefsArr.length === 1 && allUnansweredPrefsArr[0] === categoryType;
}

function getCategory(type) {
    return profileCategories.filter(category => category.type === type)[0];
}

function getCategoryName(type) {
    const category = getCategory(type);

    return category.name || Empty.string;
}

function compareArrayData(val1, val2) {
    let arr1 = [];
    let arr2 = [];

    if (val1 instanceof Array) {
        arr1 = val1;
    } else {
        arr1.push(val1);
    }

    if (val2 instanceof Array) {
        arr2 = val2;
    } else {
        arr2.push(val2);
    }

    if (arr1.length === 0 && arr2.length === 0) {
        return true;
    } else {
        return arr1.sort().toString() === arr2.sort().toString();
    }
}

function getColorIQWizardNextUnansweredQuestion(beautyPreferences) {
    const { COLOR_IQ } = PREFERENCE_TYPES;
    const colorIQindex = profileCategories.findIndex(({ type }) => type === COLOR_IQ);
    const allAnswered = isAllAnswered(beautyPreferences);
    const allUnanswered = allUnansweredPrefs(beautyPreferences);
    const isLastCat = isLastUnansweredIndex(COLOR_IQ, allAnswered, allUnanswered);
    const nextCat = getNextUnansweredQuestion(colorIQindex, profileCategories, allAnswered, allUnanswered);

    return isLastCat ? '' : nextCat;
}

function mapBeautyPreferencesToConstructorValues(beautyPreferences) {
    const prefilterExpression = [];
    const noOptions = [notSureOption, ...noPreferenceOptions];
    const masterListUniqueRefinements = getAllMasterListUniqueRefinements();

    masterListUniqueRefinements.forEach(refinement => {
        const beautyPreferenceFilter = [];

        if (!CAROUSEL_REQUIRED_TRAITS.includes(refinement.key)) {
            return;
        }

        refinement?.items.forEach(item => {
            const currentRefinementSavedBeautyPrefs = beautyPreferences[refinement?.key];

            if (currentRefinementSavedBeautyPrefs.includes(item.key)) {
                if (!noOptions.includes(item.key)) {
                    beautyPreferenceFilter.push({
                        name: refinement.key,
                        value: item.key
                    });
                }
            }

            const isLastItem = currentRefinementSavedBeautyPrefs?.length === beautyPreferenceFilter?.length;

            if (isLastItem) {
                beautyPreferenceFilter.push({
                    not: {
                        name: refinement.key,
                        value: '*'
                    }
                });
            }
        });

        if (beautyPreferenceFilter?.length > 0) {
            prefilterExpression.push({ or: beautyPreferenceFilter });
        }
    });

    const mappedData = prefilterExpression.length > 0 ? { and: prefilterExpression } : null;

    return mappedData;
}

function mapFetchedBrandsList(brandsList = {}) {
    const flatBrandsToSingleArray = Object.values(brandsList)
        .map(({ brands }) => brands)
        .flat();

    const mappedBrandsIdsAndNames = flatBrandsToSingleArray.reduce(
        (map, brand) => {
            if (brand.brandId) {
                map.brandIds.push(brand.brandId);
                map.brandNames[brand.brandId] = brand.shortName;
            }

            return map;
        },
        { brandIds: [], brandNames: {} }
    );

    return mappedBrandsIdsAndNames;
}

function getValidColorIQEntries(beautyPreferences = {}) {
    const colorIQ = beautyPreferences[PREFERENCE_TYPES.COLOR_IQ] || [];
    const colorIQWithLabValue = colorIQ.filter(tone => !!tone.labValue);

    const colorIQWithCorrectLAB = colorIQWithLabValue.reduce((acc, entry) => {
        // The LAB API expects 3 values ':' separated (l:a:b), more or less is considered buggy/invalid value
        // Sometimes the labValue comes ',' separated so we replace it with ':'
        const labValueArr = entry.labValue.replaceAll(',', ':').split(':');

        // Only push valid lab entries
        if (labValueArr.length === 3) {
            acc.push(entry);
        }

        return acc;
    }, []);

    return colorIQWithCorrectLAB;
}

function normalizeCssHexCode(hexCode = '') {
    return `#${hexCode.replaceAll('#', '')}`;
}

function shouldUpdateProgressBarMessage(beautyPreferences = {}) {
    return (
        Object.keys(beautyPreferences).filter(x => beautyPreferences[x].length && PROGRESS_BAR_UPDATE_MESSAGE_ATTRIBUTES.includes(x)).length >=
        CAROUSEL_ONE_TRAITS
    );
}

function getBrandsByIdMap(groupedBrands = {}) {
    /**
     * will return a map of all brand IDs as keys with it's value as the brand object, e.g.:
     * {
     *    12345: { brandId: 12345, shortName: 'The Brand', ... }
     *    23456: { brandId: 23456, shortName: 'Other Brand', ... }
     * }
     */
    return Object.values(groupedBrands)
        .map(({ brands }) => brands)
        .flat()
        .reduce((brandsList, brand) => {
            return {
                ...brandsList,
                ...(brand.brandId && { [brand.brandId]: brand })
            };
        }, {});
}

function filterOutUserFavBrandsSpokeIDs(userFavoriteBrandIDs = [], brandsByIdMap = {}) {
    const newUserFavoriteBrandIDs = userFavoriteBrandIDs.filter(brandId => brandsByIdMap[brandId]);

    return newUserFavoriteBrandIDs;
}

function filterOutUserFavBrandsBPpageIDs(beautyPreferences = {}, brandsByIdMap = {}) {
    const prevFavoriteBrands = beautyPreferences[PREFERENCE_TYPES.FAVORITE_BRANDS];
    const isNoPreference = prevFavoriteBrands.length === 1 && prevFavoriteBrands[0] === noPreferenceFavoriteBrands;

    if (isNoPreference) {
        return prevFavoriteBrands;
    }

    const favoriteBrands = prevFavoriteBrands.filter(brandId => brandsByIdMap[brandId]);

    return favoriteBrands;
}

export default {
    isAllAnswered,
    isAtLeastOneAnswered,
    allUnansweredPrefs,
    getNextUnansweredQuestion,
    isLastUnansweredIndex,
    calculateProfileCompletionStatus,
    getCategory,
    compareArrayData,
    getColorIQWizardNextUnansweredQuestion,
    initialUnansweredPref,
    mapFetchedBrandsList,
    getValidColorIQEntries,
    normalizeCssHexCode,
    shouldUpdateProgressBarMessage,
    getBrandsByIdMap,
    filterOutUserFavBrandsSpokeIDs,
    filterOutUserFavBrandsBPpageIDs,
    mapBeautyPreferencesToConstructorValues,
    getCategoryName,
    getLocalStorageMasterList,
    getAllMasterListUniqueRefinements,
    getDynamicRefinements,
    getUserBeautyPreferencesWithFullValues,
    getMasterListRefinementsByCategory
};
