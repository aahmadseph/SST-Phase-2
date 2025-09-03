/* eslint-disable complexity */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

import React, { useCallback } from 'react';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/UpperFunnel/locales', 'UpperFunnelFilters');
import catalogUtils from 'utils/Catalog';
import storeUtils from 'utils/Store';
import userActions from 'actions/UserActions';
import store from 'Store';
import actions from 'Actions';
import addressUtils from 'utils/Address';
import helpersUtils from 'utils/Helpers';
import {
    PICKUP,
    SAME_DAY,
    SHIP_TO_HOME,
    PICKUP_FILTER_START,
    SAME_DAY_FILTER_START,
    SHIP_TO_HOME_FILTER_START,
    PICKUP_ARIA_DESCRIBED_BY,
    SAME_DAY_ARIA_DESCRIBED_BY,
    SHIP_TO_HOME_ARIA_DESCRIBED_BY
} from 'constants/UpperFunnel';
import catalogConstantsUtils from 'utils/CatalogConstants';
const { CHECKBOXES_WITH_DROPDOWN } = catalogConstantsUtils.REFINEMENT_TYPES;

import taskQueueUtils from 'utils/TaskQueue';
const upperFunnelQueue = taskQueueUtils.createTaskQueue();

const filterParamsStart = {
    [PICKUP]: PICKUP_FILTER_START,
    [SAME_DAY]: SAME_DAY_FILTER_START,
    [SHIP_TO_HOME]: SHIP_TO_HOME_FILTER_START
};

let isMegaFilterOpen = false;

function updateFiltersModalState(open, discardDraft = false) {
    if (discardDraft) {
        upperFunnelQueue.clear();
        store.dispatch(userActions.clearUpperFunnelDraft());
    }

    isMegaFilterOpen = open;
}

function updateZipCodeInOtherFilter(filterKey, filterVal, currentSelected) {
    const selectionArray = currentSelected;

    if (filterKey === SHIP_TO_HOME || filterKey === SAME_DAY) {
        const filterIndex = selectionArray.findIndex(selectedFilter => selectedFilter.includes(filterKey === SHIP_TO_HOME ? SAME_DAY : SHIP_TO_HOME));

        if (filterIndex > -1) {
            selectionArray[filterIndex] = filterKey === SHIP_TO_HOME ? getSameDayDeliveryFilterValue(filterVal) : getShipToHomeFilterValue(filterVal);
        }
    }

    return selectionArray;
}

function combineWithActiveFilters(title, selectedFilters, filterValue) {
    const filterKey = filterValue.split('=')[0];
    const filterVal = filterValue.split('=')[1];

    const currentSelected = updateZipCodeInOtherFilter(filterKey, filterVal, [...selectedFilters[title]]);
    // Delete duplicates
    const duplicateIdx = currentSelected.findIndex(value => value.startsWith(filterKey));

    if (duplicateIdx >= 0) {
        currentSelected.splice(duplicateIdx, 1);
    }

    const result = [...currentSelected, filterValue];

    return result;
}

function getUpperFunnelFilterValueStart(key) {
    return filterParamsStart[key] || '';
}

function getPickupFilterValue(storeId) {
    if (!storeId) {
        return '';
    }

    const filterStart = getUpperFunnelFilterValueStart(PICKUP);

    return `${filterStart}=${storeId || ''}`;
}

function getUpperFunnelFiltersName(refinements) {
    const result = refinements.find(refinement => refinement.type === CHECKBOXES_WITH_DROPDOWN);

    return result?.displayName;
}

function getSameDayDeliveryFilterValue(zipCode) {
    if (!zipCode) {
        return '';
    }

    const filterStart = getUpperFunnelFilterValueStart(SAME_DAY);

    return `${filterStart}=${zipCode}`;
}

function getShipToHomeFilterValue(zipCode) {
    if (!zipCode) {
        return '';
    }

    const filterStart = getUpperFunnelFilterValueStart(SHIP_TO_HOME);

    return `${filterStart}=${zipCode}`;
}

function selectFilters(originalSelectFilters, selectedFilters, title, filterValue) {
    const nextFilterValues = combineWithActiveFilters(title, selectedFilters, filterValue);
    const applyFilters = !isMegaFilterOpen;
    originalSelectFilters({ [title]: nextFilterValues }, applyFilters);
}

function showStoreSwitcherModal(event, options) {
    event?.preventDefault();
    event?.stopPropagation();

    const { originalSelectFilters, selectedFilters, title, ...restOptions } = options;

    const storeSwitcherOptions = {
        isUpperFunnel: true,
        ...(isMegaFilterOpen && { taskQueue: upperFunnelQueue }),
        ...(restOptions && (restOptions || {}))
    };

    function callback(argumentsObj) {
        const filterValue = getPickupFilterValue(argumentsObj?.storeId);
        selectFilters(originalSelectFilters, selectedFilters, title, filterValue);
    }

    store.dispatch(
        actions.showStoreSwitcherModal({
            isOpen: true,
            options: storeSwitcherOptions,
            entry: 'filter',
            afterCallback: callback
        })
    );
}

function showZipCodeModal(event, options, isSdd) {
    event?.preventDefault();
    event?.stopPropagation();

    const { originalSelectFilters, selectedFilters, title } = options;

    function callback(argumentsObj) {
        const filterValue = isSdd
            ? getSameDayDeliveryFilterValue(argumentsObj?.zipCode || argumentsObj?.postalCode)
            : getShipToHomeFilterValue(argumentsObj?.zipCode || argumentsObj?.postalCode);
        selectFilters(originalSelectFilters, selectedFilters, title, filterValue);
    }

    const zipCodeModalOptions = { isSdd: isSdd, ...(isMegaFilterOpen && { taskQueue: upperFunnelQueue }) };

    store.dispatch(
        actions.showShippingDeliveryLocationModal({
            isOpen: true,
            entry: 'filter',
            callback: callback,
            options: zipCodeModalOptions
        })
    );
}

function upperFunnelCheckboxClick(event, options) {
    const {
        title, filterVal, originalRemoveFilterValue, selectedFilters, originalSelectFilters, isSelected
    } = options;

    if (isSelected) {
        originalRemoveFilterValue(title, filterVal, true);
    } else {
        selectFilters(originalSelectFilters, selectedFilters, title, filterVal);
    }
}

function removeShipToHomeFilter(refinementValues) {
    return refinementValues.filter(val => !(val.refinementStringValueId || val.refinementValue || '').startsWith(SHIP_TO_HOME_FILTER_START));
}

function enhanceValues(data = [], enhancedComponentProps = {}) {
    /* eslint-disable complexity */
    const {
        deliveryOptions,
        preferredStore,
        user,
        selectFilters: originalSelectFilters,
        selectedFilters,
        removeFilterValue: originalRemoveFilterValue,
        showEddOnBrowseAndSearch
    } = enhancedComponentProps;

    const deliveryOptionsStoreId = deliveryOptions?.pickup?.pickupStoreId;
    const deliveryOptionsStoreName = (deliveryOptions?.pickup?.pickupStoreName.split(':')[1] || '').trim();
    const deliveryOptionsZipCode = deliveryOptions?.sameDay?.sameDayZipCode;
    const upperFunnelName = getUpperFunnelFiltersName(data);
    const draftStoreName = preferredStore?.preferredStoreInfo?.draft?.displayName;
    const draftStoreId = preferredStore?.preferredStoreInfo?.draft?.storeId;
    const draftZipCode = addressUtils.formatZipCode(user?.draft?.preferredZipCode);
    const storeNameText = draftStoreName || preferredStore?.preferredStoreName || deliveryOptionsStoreName || getText('chooseStore');
    const userZipCode = addressUtils.formatZipCode(user?.preferredZipCode);
    const zipCodeText = draftZipCode || userZipCode || getText('setYourLocation');
    const pickupUpperFunnelFilterValue = getPickupFilterValue(draftStoreId || deliveryOptionsStoreId || preferredStore?.preferredStoreInfo?.storeId);
    const sameDayDeliveryFilterValue = getSameDayDeliveryFilterValue(draftZipCode || deliveryOptionsZipCode || userZipCode);
    const shipToHomeFilterValue = showEddOnBrowseAndSearch ? getShipToHomeFilterValue(draftZipCode || deliveryOptionsZipCode || userZipCode) : '';
    const isBopisable = preferredStore?.preferredStoreInfo?.isBopisable;
    const isSameDayFilterSelected = selectedFilters && catalogUtils.isFilterSelected(selectedFilters, SAME_DAY_FILTER_START);
    const isPickupFilterSelected = selectedFilters && catalogUtils.isFilterSelected(selectedFilters, PICKUP_FILTER_START);
    const isShipToHomeFilterSelected = selectedFilters && catalogUtils.isFilterSelected(selectedFilters, SHIP_TO_HOME_FILTER_START);

    const pickupModalTrigger = useCallback(
        e =>
            showStoreSwitcherModal(e, {
                originalSelectFilters,
                selectedFilters,
                title: upperFunnelName
            }),
        [originalSelectFilters, selectedFilters, upperFunnelName]
    );

    const pickupCheckboxTrigger = useCallback(
        e =>
            upperFunnelCheckboxClick(e, {
                originalSelectFilters,
                selectedFilters,
                title: upperFunnelName,
                filterVal: pickupUpperFunnelFilterValue,
                originalRemoveFilterValue,
                isSelected: isPickupFilterSelected
            }),
        [originalSelectFilters, selectedFilters, upperFunnelName, pickupUpperFunnelFilterValue, originalRemoveFilterValue, isPickupFilterSelected]
    );

    const sddModalTrigger = useCallback(
        e =>
            showZipCodeModal(
                e,
                {
                    originalSelectFilters,
                    selectedFilters,
                    title: upperFunnelName
                },
                true
            ),
        [originalSelectFilters, selectedFilters, upperFunnelName]
    );

    const shipToHomeModalTrigger = useCallback(
        e =>
            showZipCodeModal(
                e,
                {
                    originalSelectFilters,
                    selectedFilters,
                    title: upperFunnelName
                },
                false
            ),
        [originalSelectFilters, selectedFilters, upperFunnelName]
    );

    const sameDayCheckboxTrigger = useCallback(
        e =>
            upperFunnelCheckboxClick(e, {
                originalSelectFilters,
                selectedFilters,
                title: upperFunnelName,
                filterVal: sameDayDeliveryFilterValue,
                originalRemoveFilterValue,
                isSelected: isSameDayFilterSelected
            }),
        [originalSelectFilters, selectedFilters, upperFunnelName, sameDayDeliveryFilterValue, originalRemoveFilterValue, isSameDayFilterSelected]
    );

    const shipToHomeCheckboxTrigger = useCallback(
        e =>
            upperFunnelCheckboxClick(e, {
                originalSelectFilters,
                selectedFilters,
                title: upperFunnelName,
                filterVal: shipToHomeFilterValue,
                originalRemoveFilterValue,
                isSelected: isShipToHomeFilterSelected
            }),
        [originalSelectFilters, selectedFilters, upperFunnelName, shipToHomeFilterValue, originalRemoveFilterValue, isShipToHomeFilterSelected]
    );

    function upperFunnelFiltersConfig(value) {
        const fullStoreNameText = storeUtils.addSephoraAtStart(storeNameText);
        const describedByCompData = { zipCodeText, storeNameText, showEddOnBrowseAndSearch };
        const upperFunnelFiltersConfigProperties = {
            [PICKUP_FILTER_START]: {
                filterKey: PICKUP_FILTER_START,
                refinementValue: pickupUpperFunnelFilterValue,
                refinementValueDisplayNameComp: PICKUP,
                fullStoreNameText,
                refinementDisplayNameAndValue: `${value.refinementValueDisplayName}: ${helpersUtils.truncateText(fullStoreNameText)}`,
                refinementValueSpecificDisplayName: helpersUtils.truncateText(fullStoreNameText),
                checkboxClick: isBopisable ? null : pickupModalTrigger,
                labelClick: pickupModalTrigger,
                pillClick: isBopisable ? pickupCheckboxTrigger : pickupModalTrigger,
                isSelected: isPickupFilterSelected,
                describedById: PICKUP_ARIA_DESCRIBED_BY,
                describedByCompData
            },
            [SAME_DAY_FILTER_START]: {
                filterKey: SAME_DAY_FILTER_START,
                refinementValue: sameDayDeliveryFilterValue,
                refinementValueDisplayNameComp: SAME_DAY,
                refinementDisplayNameAndValue: `${value.refinementValueDisplayName}: ${zipCodeText}`,
                refinementValueSpecificDisplayName: zipCodeText,
                checkboxClick: userZipCode ? null : sddModalTrigger,
                labelClick: sddModalTrigger,
                pillClick: userZipCode ? sameDayCheckboxTrigger : sddModalTrigger,
                isSelected: isSameDayFilterSelected,
                describedById: SAME_DAY_ARIA_DESCRIBED_BY,
                describedByCompData
            },
            [SHIP_TO_HOME_FILTER_START]: {
                filterKey: SHIP_TO_HOME_FILTER_START,
                refinementValue: shipToHomeFilterValue,
                refinementValueDisplayNameComp: SHIP_TO_HOME,
                refinementDisplayNameAndValue: `${value.refinementValueDisplayName}: ${zipCodeText}`,
                refinementValueSpecificDisplayName: zipCodeText,
                checkboxClick: userZipCode ? null : shipToHomeModalTrigger,
                labelClick: shipToHomeModalTrigger,
                pillClick: userZipCode ? shipToHomeCheckboxTrigger : shipToHomeModalTrigger,
                isSelected: isShipToHomeFilterSelected,
                describedById: SHIP_TO_HOME_ARIA_DESCRIBED_BY,
                describedByCompData
            }
        };
        const refinementStringValueIdStart = (value.refinementStringValueId || value.refinementValue || '').split('=')[0];

        return upperFunnelFiltersConfigProperties[refinementStringValueIdStart] || {};
    }

    const enhanceRefinement = value => {
        const addedProperties = upperFunnelFiltersConfig(value) || {};

        return {
            ...value,
            ...addedProperties
        };
    };

    let enhancedRefinements = [];

    const hasUpperFunnelRefinement = data.some(refinement => refinement.type === CHECKBOXES_WITH_DROPDOWN);

    if (!hasUpperFunnelRefinement) {
        return data;
    }

    enhancedRefinements = data.map(refinement => {
        if (refinement.type === CHECKBOXES_WITH_DROPDOWN) {
            const refinementValues = !showEddOnBrowseAndSearch ? removeShipToHomeFilter(refinement.values) : refinement.values;
            const enhancedValues = refinementValues.map(enhanceRefinement);
            const enhancedRefinement = {
                ...refinement,
                values: enhancedValues
            };

            return enhancedRefinement;
        }

        return refinement;
    });

    return enhancedRefinements;
}

export default {
    filterParamsStart,
    getUpperFunnelFilterValueStart,
    getPickupFilterValue,
    showStoreSwitcherModal,
    enhanceValues,
    updateFiltersModalState,
    upperFunnelQueue,
    showZipCodeModal,
    upperFunnelCheckboxClick
};
