import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import framework from 'utils/framework';
import store from 'store/Store';
import { MasterListLoaded } from 'constants/events';
import * as beautyPreferenceConstants from 'constants/beautyPreferences';
const { noPreferenceOptions, notSureOption } = beautyPreferenceConstants;
const { Application } = framework;
import deepExtend from 'utils/deepExtend';

const SELECTION_TYPES = {
    MULTIPLE: 'MULTIPLE',
    SINGLE: 'SINGLE'
};

function sortArrayObjectsByOrderId(array) {
    if (!Array.isArray(array)) {
        return [];
    }

    const orderedArray = array.map((ref, index) => ({ ref, index }));

    orderedArray.sort((a, b) => {
        const aOrder = a.ref.orderId;
        const bOrder = b.ref.orderId;

        const aHasValidOrder = Number.isFinite(aOrder);
        const bHasValidOrder = Number.isFinite(bOrder);

        if (aHasValidOrder && bHasValidOrder) {
            return aOrder - bOrder;
        }

        if (!aHasValidOrder && !bHasValidOrder) {
            return a.index - b.index; // maintain original order
        }

        return aHasValidOrder ? -1 : 1; // valid numbers come before invalid ones
    });

    return orderedArray.map(item => item.ref);
}

function getLocalStorageMasterList() {
    return Storage.local.getItem(LOCAL_STORAGE.REFINEMENTS) || {};
}

function getMasterListRefinementWorlds() {
    return getLocalStorageMasterList().refinements || [];
}

function getMasterListRefinementWorldsOrderedById() {
    const refinementWorlds = getMasterListRefinementWorlds();
    const orderedRefinementWorlds = sortArrayObjectsByOrderId(refinementWorlds);

    return orderedRefinementWorlds;
}

function getMasterListRefinementWorldByKey(key) {
    if (!key) {
        return undefined;
    }

    return getMasterListRefinementWorlds().find(world => world.key === key);
}

function getMasterListRefinementWorldByCategoryId(categoryId) {
    if (!categoryId) {
        return undefined;
    }

    return getMasterListRefinementWorlds().find(world => world.categoryId === categoryId);
}

function executeWhenMasterListLoaded(callback) {
    Application.events.onLastLoadEvent(window, [MasterListLoaded], () => {
        callback?.();
    });
}

function getFirstValidNumberFromString(str) {
    if (!str) {
        return null;
    }

    const matches = str.match(/-?\d+(\.\d+)?/g); // matches integers or decimals (positive/negative)

    if (!matches) {
        return null;
    }

    for (const match of matches) {
        const num = Number(match);

        if (!isNaN(num)) {
            return num;
        }
    }

    return null;
}

function isSomeRefinementItemVisibleInBeautyPreferences(refinement) {
    // Special handling for Color IQ and other special refinement types
    if (refinement?.selectionType === 'COLORIQ' || refinement?.key === 'colorIq') {
        return true;
    }

    return !!refinement?.items?.some(item => item.visableInBP);
}

function isSomeRefinementItemFilterableBeautyPreferences(refinement) {
    return !!refinement?.items?.some(item => item.filterable);
}

function getVisibleInBPRefinements(refinements) {
    return sortArrayObjectsByOrderId(refinements).filter(isSomeRefinementItemVisibleInBeautyPreferences);
}

function getBeautyPreferencesWorldPageInfo(worldKey, worldCategoryId) {
    let worldInfo = undefined;

    if (worldKey) {
        worldInfo = getMasterListRefinementWorldByKey(worldKey);
    } else if (worldCategoryId) {
        worldInfo = getMasterListRefinementWorldByCategoryId(worldCategoryId);
    }

    if (!worldInfo) {
        return null;
    }

    const refinements = getVisibleInBPRefinements(worldInfo.refinements);

    return { ...worldInfo, refinements };
}

function isRefinementPresentOnCustomerPreference(worldRefinementKey, refinementKey) {
    const storeState = store?.getState();
    const customerPreference = storeState.user?.customerPreference || {};
    const prefs = customerPreference?.[worldRefinementKey]?.[refinementKey];

    return Array.isArray(prefs) && prefs.length > 0;
}

function mapCustomerPreferenceToValues(customerPreference = {}) {
    // Use Object.entries and reduce to build the final object
    return Object.entries(customerPreference).reduce((mappedCustomerPreference, [worldKey, worldPreferences]) => {
        const refinements = getMasterListRefinementWorldByKey(worldKey)?.refinements;

        // Check if refinements is a valid array
        if (!Array.isArray(refinements)) {
            mappedCustomerPreference[worldKey] = {};

            return mappedCustomerPreference; // Return the accumulator unchanged
        }

        const worldValues = Object.entries(worldPreferences).reduce((worldAccumulator, [refinementKey, preferenceKeys]) => {
            // Check if preferenceKeys is a valid array
            if (!Array.isArray(preferenceKeys)) {
                worldAccumulator[refinementKey] = [];

                return worldAccumulator;
            }

            const refinement = refinements.find(ref => ref.key === refinementKey);

            if (!refinement) {
                worldAccumulator[refinementKey] = [];

                return worldAccumulator;
            }

            const mappedValues = preferenceKeys.map(key => refinement.items?.find(item => item.key === key)?.value).filter(Boolean);

            // Only add to the accumulator if there are actual mapped values
            if (mappedValues.length > 0) {
                worldAccumulator[refinementKey] = mappedValues;
            }

            return worldAccumulator;
        }, {}); // Start with an empty object for the worldAccumulator

        mappedCustomerPreference[worldKey] = worldValues;

        return mappedCustomerPreference;
    }, {}); // Start with an empty object for the mappedCustomerPreference
}

function _checkForColorIqProgress() {
    const storeState = store?.getState();
    const colorIQ = storeState.user?.colorIQ || storeState.user?.colorIq || [];

    return colorIQ.some(item => {
        const hasIsRecentProp = Object.prototype.hasOwnProperty.call(item, 'isRecent');

        return !hasIsRecentProp || item.isRecent === 'Y' || item.isRecent === true;
    });
}

function _isRefinementComplete(refinement, worldInfo) {
    const isColorIQ = refinement.selectionType === 'COLORIQ' || refinement.key === 'colorIq';

    return isColorIQ ? _checkForColorIqProgress() : isRefinementPresentOnCustomerPreference(worldInfo?.key, refinement.key);
}

function beautyPreferencesWorldProgress(worldInfo) {
    const refinements = getVisibleInBPRefinements(worldInfo?.refinements);
    let completedRefinementsCount = 0;

    refinements?.forEach(refinement => {
        if (_isRefinementComplete(refinement, worldInfo)) {
            completedRefinementsCount++;
        }
    });

    return {
        refinementsCount: refinements.length || 0,
        completedRefinementsCount
    };
}

function isValidPreferenceEntry({ worldKey, refinementKey, refinementItemsKeys }) {
    return Boolean(worldKey && refinementKey && Array.isArray(refinementItemsKeys));
}

function addCustomerPreferenceEntries(customerPreference = {}, entries = []) {
    const newCustomerPreference = { ...customerPreference };

    entries.forEach(entry => {
        if (!this.isValidPreferenceEntry(entry)) {
            Sephora.logger.warn('Skipped invalid preference entry', entry);

            return;
        }

        const { worldKey, refinementKey, refinementItemsKeys } = entry;

        if (!newCustomerPreference[worldKey]) {
            newCustomerPreference[worldKey] = {};
        }

        newCustomerPreference[worldKey][refinementKey] = refinementItemsKeys;
    });

    return newCustomerPreference;
}

function normalizeCssHexCode(hexCode = '') {
    return `#${hexCode.replaceAll('#', '')}`;
}

// Helper function to get valid Color IQ entries
function getValidColorIQEntries(colorIQData) {
    const colorIQ = Array.isArray(colorIQData) ? colorIQData : [];
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

/**
 * Transforms a recommendations array (mocked or real) into the format expected by the RecommendationsCarousel.
 * @param {Array} recommendations - Array of recommendation objects
 * @returns {Array} Transformed recommendations for carousel display
 */
function transformRecommendationsForCarousel(recommendations = []) {
    return recommendations.map(recommendation => {
        const data = recommendation.data || {};
        const currentSku = data.currentSku || {};
        const variationsMap = recommendation.variationsMap || {};

        function formatPriceRangeToString(minPrice, maxPrice) {
            if (!minPrice || !maxPrice) {
                return null;
            }

            const formattedMin = minPrice.toFixed(2);
            const formattedMax = maxPrice.toFixed(2);

            return formattedMin === formattedMax ? `$${formattedMax}` : `$${formattedMin} - $${formattedMax}`;
        }

        let listPrice = data.listPrice;
        let salePrice = data.salePrice;

        if (variationsMap) {
            const { minListPrice, maxListPrice, minSalePrice, maxSalePrice } = variationsMap;

            const formattedList = formatPriceRangeToString(minListPrice, maxListPrice);

            if (formattedList) {
                listPrice = formattedList;
            }

            const formattedSale = formatPriceRangeToString(minSalePrice, maxSalePrice);

            if (formattedSale) {
                salePrice = formattedSale;
            }
        }

        return {
            badgeAltText: currentSku.imageAltText,
            biExclusiveLevel: currentSku.biExclusivityLevel,
            brandName: data.brandName,
            starRatings: data.rating,
            size: currentSku.sizeRefinement,
            productReviewCount: data.totalReviews,
            image: data.imageUrl,
            isAppExclusive: !!currentSku.isAppExclusive,
            isBiOnly: !!currentSku.isBI,
            isFirstAccess: !!currentSku.isFirstAccess,
            isFree: !!currentSku.isFree,
            isLimitedEdition: !!currentSku.isLimitedEdition,
            isLimitedQuantity: !!currentSku.isLimitedQuantity,
            isLimitedTimeOffer: !!currentSku.isLimitedTimeOffer,
            isNew: !!currentSku.isNew,
            isOnlineOnly: !!currentSku.isOnlineOnly,
            isOutOfStock: !!currentSku.isOutOfStock,
            isSephoraExclusive: !!currentSku.isSephoraExclusive,
            listPrice: listPrice,
            salePrice: salePrice,
            valuePrice: data.valuePrice,
            wholeSalePrice: data.wholesalePrice,
            productId: data.productId,
            productName: recommendation.value,
            skuId: currentSku.skuId,
            skuImages: {
                imageUrl: data.imageUrl
            },
            smallImage: currentSku.skuImages?.image135,
            targetUrl: data.url,
            variationId: data.variationId,
            variationType: currentSku.variationValue,
            variationTypeDisplayName: currentSku.variationValue,
            variationValue: currentSku.variationValue,
            highlights: (data.facets || []).find(f => f.name === 'ingredientPreferences')?.values || [],
            strategyId: recommendation.strategy?.id
        };
    });
}

function mapBeautyPreferencesToRecsServiceValues(customerPreference, worldKey) {
    const prefilterExpression = [];

    if (!customerPreference || !worldKey) {
        return null;
    }

    const noOptions = [notSureOption, ...noPreferenceOptions];
    const worldRefinementsByKey = getMasterListRefinementWorldByKey(worldKey);

    worldRefinementsByKey?.refinements.forEach(refinement => {
        const beautyPreferenceFilter = [];
        const filterableRefinements = isSomeRefinementItemFilterableBeautyPreferences(refinement);

        if (!filterableRefinements) {
            return;
        }

        refinement?.items.forEach(item => {
            const currentRefinementSavedBeautyPrefs = customerPreference[refinement?.key];

            if (currentRefinementSavedBeautyPrefs?.includes(item.key)) {
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

function isAtLeastOneAnsweredForWorld(customerPreference = {}, worldKey) {
    if (!worldKey || typeof worldKey !== 'string') {
        return false;
    }

    const worldPreferences = customerPreference[worldKey];

    if (worldPreferences && typeof worldPreferences === 'object') {
        return Object.values(worldPreferences).some(preferences => Array.isArray(preferences) && preferences.length > 0);
    }

    return false;
}

// Transform old BP format to new format based on the worldKey
function getNewCustomerPreference(beautyPreferencesToSave, worldRefinements) {
    // World refinements = specific categoryId refinements coming from the master list
    if (!beautyPreferencesToSave || !worldRefinements || !Array.isArray(worldRefinements.refinements)) {
        return {};
    }

    const newCustomerPreference = {};

    for (const selectionKey of Object.keys(beautyPreferencesToSave)) {
        const selectedItems = beautyPreferencesToSave[selectionKey];

        if (!Array.isArray(selectedItems)) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const refinement = worldRefinements.refinements.find(r => r.key === selectionKey);

        if (!refinement || !Array.isArray(refinement.items)) {
            // eslint-disable-next-line no-continue
            continue;
        }

        // Check if any selected item matches a refinement item
        const hasMatch = selectedItems.some(selected => refinement.items.some(item => item.key === selected.key));

        if (hasMatch) {
            // If syncedWorlds is a non-empty array, use it; otherwise use worldRefinements.key
            let targetWorlds = [];

            if (Array.isArray(refinement.syncedWorlds) && refinement.syncedWorlds.length > 0) {
                targetWorlds = refinement.syncedWorlds;
            } else {
                if (typeof worldRefinements.key === 'string') {
                    targetWorlds = [worldRefinements.key];
                }
            }

            targetWorlds.forEach(worldKey => {
                if (!newCustomerPreference[worldKey]) {
                    newCustomerPreference[worldKey] = {};
                }

                // Map to array of keys only
                newCustomerPreference[worldKey][selectionKey] = selectedItems.map(item => item.key);
            });
        }
    }

    return newCustomerPreference;
}

// Combine existing customer preference with new customer preference to maintain same format and avoid dups
function mergeCustomerPreference(existingCustomerPreferences = {}, newCustomerPreferences = {}) {
    const existingCustomerPreferencesCopy = deepExtend({}, existingCustomerPreferences);

    // Merge in new preferences
    for (const worldKey of Object.keys(newCustomerPreferences)) {
        if (!existingCustomerPreferencesCopy[worldKey]) {
            existingCustomerPreferencesCopy[worldKey] = {};
        }

        const oldWorld = existingCustomerPreferencesCopy[worldKey];
        const newWorld = newCustomerPreferences[worldKey];

        for (const refinementKey of Object.keys(newWorld)) {
            const newBeautyPrefs = Array.isArray(newWorld[refinementKey]) ? newWorld[refinementKey] : [];
            const oldBeautyPrefs = Array.isArray(oldWorld[refinementKey]) ? oldWorld[refinementKey] : [];

            if (oldBeautyPrefs.length > 0) {
                // Keep old order, add only new unique values from newBeautyPrefs at the end
                const mergedArr = oldBeautyPrefs.concat(newBeautyPrefs.filter(val => !oldBeautyPrefs.includes(val)));
                oldWorld[refinementKey] = mergedArr;
            } else {
                oldWorld[refinementKey] = [...newBeautyPrefs];
            }
        }
    }

    return existingCustomerPreferencesCopy;
}

function areAllWorldsComplete() {
    const allWorlds = getMasterListRefinementWorlds() || [];

    if (!allWorlds.length) {
        return false;
    }

    return allWorlds.every(world => {
        const { refinementsCount, completedRefinementsCount } = beautyPreferencesWorldProgress(world);

        return refinementsCount > 0 && completedRefinementsCount === refinementsCount;
    });
}

export default {
    SELECTION_TYPES,
    getLocalStorageMasterList,
    getMasterListRefinementWorlds,
    getMasterListRefinementWorldByKey,
    executeWhenMasterListLoaded,
    sortArrayObjectsByOrderId,
    getMasterListRefinementWorldsOrderedById,
    getFirstValidNumberFromString,
    isSomeRefinementItemVisibleInBeautyPreferences,
    getBeautyPreferencesWorldPageInfo,
    isRefinementPresentOnCustomerPreference,
    beautyPreferencesWorldProgress,
    addCustomerPreferenceEntries,
    isValidPreferenceEntry,
    normalizeCssHexCode,
    getValidColorIQEntries,
    transformRecommendationsForCarousel,
    getMasterListRefinementWorldByCategoryId,
    mapBeautyPreferencesToRecsServiceValues,
    isSomeRefinementItemFilterableBeautyPreferences,
    isAtLeastOneAnsweredForWorld,
    mapCustomerPreferenceToValues,
    getNewCustomerPreference,
    mergeCustomerPreference,
    areAllWorldsComplete
};
