/* eslint-disable complexity */
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import basketSelector from 'selectors/basket/basketSelector';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import Actions from 'actions/Actions';
import DeliveryOptionsUtils from 'utils/DeliveryOptions';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import BCCUtils from 'utils/BCC';
import stringUtils from 'utils/String';
import SDDRougeTestV2InfoModal from 'utils/SDDRougeTestV2InfoModal';
import basketUtils from 'utils/Basket';
import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
import { globalModals } from 'utils/globalModals';

const { SDD_FULFILLMENT_SERVICE_INFO } = globalModals;
const { getSDDCountdownMessage, isSDUAllowedForUser } = DeliveryOptionsUtils;
const { MEDIA_IDS } = BCCUtils;
const { wrapHOC } = FrameworkUtils;
const { preferredZipCodeSelector } = PreferredZipCodeSelector;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = localeUtils;
const { showShippingDeliveryLocationModal } = Actions;
const { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA } = MEDIA_IDS;
const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');

const fields = createSelector(
    preferredZipCodeSelector,
    userSubscriptionsSelector,
    basketSelector,
    globalModalsSelector,
    (_, ownProps) => ownProps.sameDayNotAvailableForZip,
    (_, ownProps) => ownProps.currentProduct,
    (_, ownProps) => ownProps.serviceUnavailable,
    (_, ownProps) => ownProps.sameDayAvailable,
    (_, ownProps) => ownProps.displayOrderCutoffCountdown,
    (_, ownProps) => ownProps.toggleSDULandingPage,
    (_, ownProps) => ownProps.sameDayDelivery,
    createStructuredSelector({
        forText: getTextFromResource(getText, 'for'),
        yourLocationText: getTextFromResource(getText, 'yourLocation'),
        changeLocationText: getTextFromResource(getText, 'changeLocation'),
        notAvailableText: getTextFromResource(getText, 'notAvailable'),
        aboutSameDayDeliveryText: getTextFromResource(getText, 'aboutSameDayDelivery'),
        sddTemporarilyUnavailableAtLocationText: getTextFromResource(getText, 'sddTemporarilyUnavailableAtLocation'),
        sameDayDeliveryNotAvailableText: getTextFromResource(getText, 'sameDayDeliveryNotAvailable'),
        sddRougeFreeShipMessageText: getTextFromResource(getText, 'sddRougeFreeShipMessage'),
        sddRougeTestV2Message: getTextFromResource(getText, 'sddRougeTestV2Message', ['{0}']),
        sddRougeTestV2FreeShippingMessage: getTextFromResource(getText, 'sddRougeTestV2FreeShippingMessage')
    }),
    (
        preferredZipCode,
        userSubscriptions,
        basket,
        globalModalsData,
        sameDayNotAvailableForZip,
        currentProduct,
        serviceUnavailable,
        sameDayAvailable,
        displayOrderCutoffCountdown,
        toggleSDULandingPage,
        sameDayDelivery,
        initialTextResources
    ) => {
        const { currentSku = {}, SDDRougeTestRemainToFreeShipping, SDDRougeTestThreshold, SDDRougeTestFreeShipping } = currentProduct;
        const actionFlags = currentSku?.actionFlags;
        const isSameDayEligibleSku = currentSku?.isSameDayEligibleSku;
        const sameDayAvailabilityStatus = actionFlags?.sameDayAvailabilityStatus;
        const isOutOfStock = ExtraProductDetailsUtils.isOutOfStock(sameDayAvailabilityStatus);
        const locationText = preferredZipCode || initialTextResources.yourLocationText;
        const changeLocationText = (isOutOfStock || sameDayNotAvailableForZip) && initialTextResources.changeLocationText;
        const availabilityLabel = sameDayAvailabilityStatus
            ? ExtraProductDetailsUtils.availabilityLabel(sameDayAvailabilityStatus)
            : 'selectForStoreAvailability';
        const availabilityText = sameDayNotAvailableForZip ? initialTextResources.notAvailableText : getText(availabilityLabel);
        const showSddAsAvailable = !sameDayNotAvailableForZip && !serviceUnavailable && sameDayAvailabilityStatus;
        const sameDayDeliveryMessage =
            isOutOfStock || !currentSku?.sameDayDeliveryMessage
                ? null
                : displayOrderCutoffCountdown
                    ? getSDDCountdownMessage(currentSku?.sameDayDeliveryMessage)
                    : currentSku?.sameDayDeliveryMessage;
        const aboutSameDayDeliveryLink = initialTextResources.aboutSameDayDeliveryText;
        const sameDayUnavailableMessage = serviceUnavailable
            ? initialTextResources.sddTemporarilyUnavailableAtLocationText
            : !isSameDayEligibleSku && sameDayAvailable
                ? initialTextResources.sameDayDeliveryNotAvailableText
                : null;
        const availabilityTextColor = !sameDayAvailabilityStatus ? null : !isSameDayEligibleSku ? 'gray' : isOutOfStock ? 'red' : 'green';
        const sddRougeFreeShipMessage =
            userUtils.isSDDRougeFreeShipEligible() && isSameDayEligibleSku && initialTextResources.sddRougeFreeShipMessageText;
        const isSDDRougeTestV2 = SDDRougeTestThreshold;
        const currentSDDRougeTestRemainToFreeShipping =
            SDDRougeTestRemainToFreeShipping !== basket.SDDRougeTestRemainToFreeShipping
                ? basket.SDDRougeTestRemainToFreeShipping
                : SDDRougeTestRemainToFreeShipping;
        const currentSDDRougeTestFreeShipping =
            SDDRougeTestFreeShipping !== basket.SDDRougeTestFreeShipping ? basket.SDDRougeTestFreeShipping : SDDRougeTestFreeShipping;
        const sddRougeTestV2FreeShippingMessage =
            isSDDRougeTestV2 &&
            (currentSDDRougeTestRemainToFreeShipping && !currentSDDRougeTestFreeShipping
                ? stringUtils.format(initialTextResources.sddRougeTestV2Message, currentSDDRougeTestRemainToFreeShipping)
                : initialTextResources.sddRougeTestV2FreeShippingMessage);
        const showSDDRougeTestV2InfoModal = () => SDDRougeTestV2InfoModal.showModal(toggleSDULandingPage, SDDRougeTestThreshold);
        const sameDayItems = basketUtils.getSameDayItems(basket);
        const hasSameDayItems = basketUtils.hasSameDayItems();
        const sddRougeV2SameDayDeliveryMessage = hasSameDayItems && sameDayItems.sameDayDeliveryMessage;
        const displayedSameDayDeliveryMessage =
            isSDDRougeTestV2 && sddRougeV2SameDayDeliveryMessage && sameDayDelivery ? sddRougeV2SameDayDeliveryMessage : sameDayDeliveryMessage;

        const isUserSDUTrialAllowed = isSDUAllowedForUser(userSubscriptions);
        const isCanada = localeUtils.isCanada();
        const sduMediaId = isCanada ? SAME_DAY_UNLIMITED_MODAL_CA : SAME_DAY_UNLIMITED_MODAL_US;

        const textResources = {
            ...initialTextResources,
            locationText,
            changeLocationText,
            availabilityText,
            aboutSameDayDeliveryLink,
            sameDayUnavailableMessage,
            sddRougeFreeShipMessage,
            sddRougeTestV2FreeShippingMessage
        };

        return {
            preferredZipCode,
            showSddAsAvailable,
            sameDayDeliveryMessage,
            availabilityTextColor,
            sameDayAvailabilityStatus,
            isUserSDUTrialAllowed,
            isCanada,
            sduMediaId,
            textResources,
            showSDDRougeTestV2InfoModal,
            displayedSameDayDeliveryMessage,
            sddFulFillmentServiceInfoModal: globalModalsData[SDD_FULFILLMENT_SERVICE_INFO]
        };
    }
);

const functions = {
    showShippingDeliveryLocationModal
};

const withSameDayDeliveryProps = wrapHOC(connect(fields, functions));

export {
    fields, withSameDayDeliveryProps
};
