/* eslint-disable complexity */
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import CurrentProductUserSpecificDetailsSelector from 'selectors/page/product/currentProductUserSpecificDetails/currentProductUserSpecificDetailsSelector';
import storeUtils from 'utils/Store';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import DeliveryOptionsUtils from 'utils/DeliveryOptions';
import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
import { globalModals } from 'utils/globalModals';
import Empty from 'constants/empty';
import { BOPIS_WARNING_KEY } from 'components/GlobalModals/ChooseOptionsModal/constants';

const { getBOPISCountdownMessage } = DeliveryOptionsUtils;
const { wrapHOC } = FrameworkUtils;
const { currentProductUserSpecificDetailsSelector } = CurrentProductUserSpecificDetailsSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { BOPIS_SERVICE_INFO_FAQS } = globalModals;
const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');

const fields = createSelector(
    currentProductUserSpecificDetailsSelector,
    (_, ownProps) => ownProps.preferredStoreInfo,
    (_, ownProps) => ownProps.currentProduct,
    (_, ownProps) => ownProps.isSelected,
    (_, ownProps) => ownProps.displayOrderCutoffCountdown,
    globalModalsSelector,
    createStructuredSelector({
        atText: getTextFromResource(getText, 'at'),
        storesNearYouText: getTextFromResource(getText, 'storesNearYou'),
        pickUpNotOfferedText: getTextFromResource(getText, 'pickUpNotOffered'),
        pickUpNotOfferedForItemText: getTextFromResource(getText, 'pickUpNotOfferedForItem'),
        checkOtherStoresText: getTextFromResource(getText, 'checkOtherStores'),
        inStorePickupText: getTextFromResource(getText, 'inStorePickup'),
        curbsidePickupText: getTextFromResource(getText, 'curbsidePickup'),
        curbsideConciergeText: getTextFromResource(getText, 'curbsideConcierge')
    }),
    (
        currentProductUserSpecificDetails,
        preferredStoreInfo,
        currentProduct,
        isSelected,
        displayOrderCutoffCountdown,
        globalModalsData,
        initialTextResources
    ) => {
        const { currentSku = {}, warnings = Empty.Array } = currentProduct;
        const isPickUpEligibleSku = currentSku?.isPickUpEligibleSku;
        const { isCurbsideEnabled, isConciergeCurbsideEnabled, isBopisable } = preferredStoreInfo;
        const isReservationNotOffered = currentSku.actionFlags?.isReservationNotOffered;
        const pickupStoreName = storeUtils.getStoreDisplayName(preferredStoreInfo);
        const availabilityStatus = currentSku.actionFlags?.availabilityStatus;
        const availabilityLabel = ExtraProductDetailsUtils.availabilityLabel(availabilityStatus);
        const availabilityText = getText(availabilityLabel);
        const isOutOfStock = ExtraProductDetailsUtils.isOutOfStock(availabilityStatus);
        const availabilityTextColor = !availabilityStatus ? null : isReservationNotOffered ? 'gray' : isOutOfStock ? 'red' : 'green';
        const storeNameText = pickupStoreName || initialTextResources.storesNearYouText;
        const bopisWarning = warnings.find(warning => warning.key === BOPIS_WARNING_KEY);
        const pickupNotOfferedText = bopisWarning?.errorMessages?.[0] || initialTextResources.pickUpNotOfferedText;

        const pickupMessage = isReservationNotOffered
            ? pickupNotOfferedText
            : isOutOfStock
                ? initialTextResources.pickUpNotOfferedForItemText
                : currentProduct.pickupMessage && displayOrderCutoffCountdown
                    ? getBOPISCountdownMessage(currentProduct.pickupMessage)
                    : currentProduct.pickupMessage;
        const pickupMessageColor = isReservationNotOffered || isOutOfStock ? 'gray' : 'green';
        const checkOtherStoresText = (isReservationNotOffered || isOutOfStock) && initialTextResources.checkOtherStoresText;
        let showCurbsidePickupIndicator, showConciergeCurbsidePickupIndicator, storePickupIndicator;
        const aboutBuyOnlineAndPickUpLink = getText('aboutBuyOnlineAndPickUp');

        const textResources = {
            ...initialTextResources,
            storeNameText,
            availabilityText,
            pickupMessage: isSelected && pickupMessage,
            checkOtherStoresText,
            aboutBuyOnlineAndPickUpLink
        };

        if (isBopisable && isPickUpEligibleSku && !isOutOfStock && !isReservationNotOffered) {
            storePickupIndicator = initialTextResources.inStorePickupText;

            if (isCurbsideEnabled || isConciergeCurbsideEnabled) {
                showCurbsidePickupIndicator = !isConciergeCurbsideEnabled && isCurbsideEnabled;
                showConciergeCurbsidePickupIndicator = isConciergeCurbsideEnabled;
            }
        }

        return {
            currentProductUserSpecificDetails,
            preferredStoreInfo,
            pickupStoreName: pickupStoreName,
            availabilityStatus,
            availabilityLabel,
            availabilityTextColor,
            textResources,
            pickupMessageColor,
            showCurbsidePickupIndicator,
            showConciergeCurbsidePickupIndicator,
            storePickupIndicator,
            aboutBopisModal: globalModalsData[BOPIS_SERVICE_INFO_FAQS]
        };
    }
);

const withBOPISProps = wrapHOC(connect(fields));

export {
    fields, withBOPISProps
};
