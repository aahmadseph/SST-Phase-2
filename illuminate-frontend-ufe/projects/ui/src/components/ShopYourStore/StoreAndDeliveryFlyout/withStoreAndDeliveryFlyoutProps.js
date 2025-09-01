import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import addressUtils from 'utils/Address';
import LanguageLocale from 'utils/LanguageLocale';
import storeUtils from 'utils/Store';
import HelperUtils from 'utils/Helpers';
import { STORE } from 'constants/Shared';
import Actions from 'Actions';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/ShopYourStore/StoreAndDeliveryFlyout/locales', 'StoreAndDeliveryFlyout');

import { storeAndDeliveryFlyoutSelector } from 'selectors/storeAndDeliveryFlyout/storeAndDeliveryFlyoutSelector';
import preferredStoreInfoSelector from 'selectors/user/preferredStoreInfoSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
const { preferredZipCodeSelector } = PreferredZipCodeSelector;

const localizationSelector = createStructuredSelector({
    shopThisStore: getTextFromResource(getText, 'shopThisStore'),
    shopSameDay: getTextFromResource(getText, 'shopSameDay'),
    sameDayDeliveryTo: getTextFromResource(getText, 'sameDayDeliveryTo'),
    openUntil: () => vars => getTextFromResource(getText, 'openUntil', vars)(),
    closed: getTextFromResource(getText, 'closed'),
    storeDetails: getTextFromResource(getText, 'storeDetails'),
    findASephora: getTextFromResource(getText, 'findASephora'),
    shopYourStore: getTextFromResource(getText, 'shopYourStore'),
    shopSameDayDelivery: getTextFromResource(getText, 'shopSameDayDelivery'),
    chooseStore: getTextFromResource(getText, 'chooseStore'),
    chooseStoreToBegin: getTextFromResource(getText, 'chooseStoreToBegin'),
    chooseLocation: getTextFromResource(getText, 'chooseLocation'),
    chooseLocationToBegin: getTextFromResource(getText, 'chooseLocationToBegin')
});

const fields = createSelector(
    localizationSelector,
    storeAndDeliveryFlyoutSelector,
    preferredStoreInfoSelector,
    preferredZipCodeSelector,
    (localization, storeAndDeliveryFlyout, preferredStoreInfo, preferredZipCode) => {
        const hasPreferredStore = !!preferredStoreInfo.storeId && !!preferredStoreInfo.displayName;
        const hasPreferredZipCode = !!preferredZipCode;
        const storeName = hasPreferredStore ? storeUtils.getStoreDisplayNameWithSephora(preferredStoreInfo) : '';
        const address1 = preferredStoreInfo.address?.address1;
        const address2 = preferredStoreInfo.address?.address2;
        const city = preferredStoreInfo.address?.city;
        const state = preferredStoreInfo.address?.state;
        const postalCode = preferredStoreInfo.address?.postalCode;
        const targetUrl = preferredStoreInfo.targetUrl;
        const closingTime = hasPreferredStore ? storeUtils.getStoreTodayClosingTime(preferredStoreInfo.storeHours)?.replace(/^0/, '') : null;
        const isStoreClosed = !closingTime || closingTime === STORE.CLOSED;
        const storeClosingTime = isStoreClosed ? localization.closed : localization.openUntil([closingTime]);
        const formattedZipCode = addressUtils.formatZipCode(preferredZipCode);
        const sameDayDeliveryTo = `${localization.sameDayDeliveryTo} ${formattedZipCode}`;
        const shopSameDay = HelperUtils.truncateText(localization.shopSameDay, 32);

        const isBopisable = storeAndDeliveryFlyout.storeDetails?.isBopisable || preferredStoreInfo.isBopisable;
        const sameDayAvailable = storeAndDeliveryFlyout.sameDay?.sameDayAvailable;
        const pickupMessage = isBopisable ? storeAndDeliveryFlyout.storeDetails?.pickupMessage : '';
        const deliveryMessage = sameDayAvailable ? storeAndDeliveryFlyout.sameDay?.deliveryMessage : '';

        const shoppingOptions = [
            {
                available: !!preferredStoreInfo.isBopisable,
                translationKey: 'inStorePickup'
            },
            {
                available: !!preferredStoreInfo.isCurbsideEnabled,
                translationKey: 'curbsidePickup'
            },
            {
                available: !!storeAndDeliveryFlyout.storeDetails?.isBeautyServicesEnabled,
                translationKey: 'beautyServices'
            },
            {
                available: !!storeAndDeliveryFlyout.storeDetails?.isStoreEventsEnabled,
                translationKey: 'storeEvents'
            }
        ];
        const hasShoppingOptions = shoppingOptions.some(option => option.available);

        return {
            localization,
            hasPreferredStore,
            hasPreferredZipCode,
            storeName,
            address1,
            address2,
            city,
            state,
            postalCode,
            isStoreClosed,
            storeClosingTime,
            targetUrl,
            shoppingOptions,
            hasShoppingOptions,
            sameDayDeliveryTo,
            deliveryMessage,
            pickupMessage,
            shopSameDay
        };
    }
);

const functions = {
    showStoreSwitcherModal: () =>
        Actions.showStoreSwitcherModal({ isOpen: true, showStoreDetails: false, options: { isHeader: true }, entry: 'top nav' }),
    showShippingDeliveryLocationModal: () =>
        Actions.showShippingDeliveryLocationModal({ isOpen: true, options: { isHeader: true }, entry: 'top nav' })
};

const withStoreAndDeliveryFlyoutProps = wrapHOC(connect(fields, functions));

export {
    fields, withStoreAndDeliveryFlyoutProps
};
