import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import { isSDUAddedToBasketSelector } from 'viewModel/selectors/basket/isSDUAddedToBasketSelector';
import Actions from 'actions/Actions';
import basketConsts from 'constants/Basket';
import preferredStoreInfoSelector from 'selectors/user/preferredStoreInfoSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import { showBopisSelectorCopyOnPdpSelector } from 'viewModel/selectors/testTarget/showBopisSelectorCopyOnPdpSelector';
import { shipToHomeSelector } from 'selectors/page/product/fulfillmentOptions/deliveryOptions/shipToHome/shipToHomeSelector';
import skuUtils from 'utils/Sku';
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import chooseOptionsModalUtils from 'utils/ChooseOptionsModal/ChooseOptionsModalUtils';

const { mapDeliveryOptionToType } = chooseOptionsModalUtils;
const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = localeUtils;
const { DELIVERY_OPTIONS } = basketConsts;
const { showSignInModal } = Actions;
const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');

const fields = createSelector(
    basketSelector,
    userSubscriptionsSelector,
    (_state, ownProps) => ownProps.product,
    (_state, ownProps) => ownProps.currentSku,
    preferredStoreInfoSelector,
    showBopisSelectorCopyOnPdpSelector,
    (_state, ownProps) => ownProps.serviceUnavailable,
    createStructuredSelector({
        autoReplenishTitle: getTextFromResource(getText, 'autoReplenishTitle')
    }),
    shipToHomeSelector,
    isSDUAddedToBasketSelector,
    (
        basket,
        userSubscriptions,
        product,
        currentSkuProp,
        preferredStoreInfo,
        showBopisSelectorCopyOnPdp,
        serviceUnavailable,
        textResources,
        shipToHome,
        isSDUAddedToBasket
    ) => {
        const { sduProduct } = product;
        const currentSku = currentSkuProp || product.currentSku;
        const { isSameDayEligibleSku, sameDayTitle, sameDayDeliveryMessage } = currentSku;
        const sameDayTrimmedMessage = sameDayDeliveryMessage?.match(/(starting at \$\d+(\.\d{2})?|à partir de \d+(,\d{2})? \$)/)?.[0];
        const isOnlineOnly = skuUtils.isOnlineOnly(currentSku);
        const isGiftCard = skuUtils.isGiftCard(currentSku);
        const pickupMessage = product.pickupMessage;

        // BOPIS info
        const determineHasPickupMessage = () =>
            Boolean(
                pickupMessage?.includes(getText('readyTomorrow')) ||
                    pickupMessage?.includes(getText('readyToday')) ||
                    pickupMessage?.includes(getText('getItToday')) ||
                    pickupMessage?.includes('recevez aujourd’hui')
            );

        const hasPickupMessage = determineHasPickupMessage();

        const getBopisInfo = () => {
            const bopisTitle = isGiftCard ? getText('availableInAllStores') : isOnlineOnly ? getText('onlineOnly') : getText('buyOnlineAndPickUp');
            const bopisSubTitle = !currentSku.isPickUpEligibleSku ? getText('pickUpNotOfferedForItem') : preferredStoreInfo?.displayName;
            const displayBopis = Sephora.configurationSettings.isBOPISEnabled;
            const bopisCutoffSubTitle = pickupMessage?.includes(getText('readyTomorrow'))
                ? getText('getItTomorrow')
                : hasPickupMessage
                    ? getText('readyWithinTwoHours')
                    : bopisSubTitle;

            return { bopisTitle, bopisSubTitle, displayBopis, bopisCutoffSubTitle };
        };

        // SDD info
        const getSameDayInfo = () => {
            const isCustomSets = !!(skuUtils.isCustomSetsSingleSkuProduct(product) || skuUtils.isCustomSetsGroupedSkuProduct(product));
            const shippingMethodNotAvailable =
                isGiftCard || isOnlineOnly || isCustomSets || skuUtils.isGwp(currentSku) || skuUtils.isSample(currentSku) || !isSameDayEligibleSku;
            const isSameDayShippingEnabled = Sephora.configurationSettings.isSameDayShippingEnabled;
            const sameDayTitleText = sameDayTitle || getText('sameDayDelivery');
            const sameDaySubTitle = !isSameDayEligibleSku && getText('sameDayDeliveryNotAvailable');
            const sddRadioButtonDisabled = shippingMethodNotAvailable || serviceUnavailable;
            const sduSubscriptions = userSubscriptions?.filter(subscription => subscription.type === 'SDU');
            const isUserSDUTrialEligible = sduSubscriptions.length > 0 ? sduSubscriptions[0]?.isTrialEligible : true;

            return {
                shippingMethodNotAvailable,
                isSameDayShippingEnabled,
                sameDayTitleText,
                sameDaySubTitle,
                sddRadioButtonDisabled,
                isUserSDUTrialEligible,
                ...sduProduct
            };
        };

        // STH info
        const getItShippedTitle = shipToHome?.shipToHomeTitle ? shipToHome.shipToHomeTitle : getText('getItShippedTitle');
        const getItShippedSubTitle = shipToHome?.shipToHomeMessage ? shipToHome.shipToHomeMessage : '';
        const signInText = getText('signIn');
        const forFreeShippingText = getText('forFreeShipping');

        // Building the delivery options array
        const bopisInfo = getBopisInfo();
        const sameDayInfo = getSameDayInfo();

        const buildDeliveryOptionsArray = () => {
            return [
                {
                    deliveryOption: DELIVERY_OPTIONS.STANDARD,
                    iconName: 'truck',
                    title: userUtils.isAnonymous() ? getItShippedTitle : getText('freeShipping'),
                    smTitle: getText('getItShippedTitle'),
                    subTitle: getItShippedSubTitle
                },
                {
                    deliveryOption: DELIVERY_OPTIONS.SAME_DAY,
                    title: sameDayInfo.sameDayTitleText,
                    subTitle: sameDayInfo.sameDaySubTitle,
                    smSubTitle: sameDayTrimmedMessage,
                    iconName: 'bag',
                    bccMediaSpecInfo: 'sameDay',
                    hideDeliveryOption: !sameDayInfo.isSameDayShippingEnabled,
                    disabled: sameDayInfo.sddRadioButtonDisabled
                },
                {
                    deliveryOption: DELIVERY_OPTIONS.PICKUP,
                    title: bopisInfo.bopisTitle,
                    subTitle: showBopisSelectorCopyOnPdp && currentSku.isPickUpEligibleSku ? bopisInfo.bopisCutoffSubTitle : bopisInfo.bopisSubTitle,
                    iconName: 'store',
                    disabled: !currentSku.isPickUpEligibleSku,
                    preferredStoreInfo: preferredStoreInfo,
                    currentProduct: product,
                    hideDeliveryOption: !bopisInfo.displayBopis,
                    bccMediaSpecInfo: 'bopisStore'
                }
            ];
        };

        const DELIVERY_OPTIONS_ARRAY = buildDeliveryOptionsArray();

        return {
            basket,
            deliveryOptions: DELIVERY_OPTIONS_ARRAY,
            shippingMethodNotAvailable: sameDayInfo.shippingMethodNotAvailable,
            isUserSduTrialEligible: sameDayInfo.isUserSduTrialEligible,
            sddRadioButtonDisabled: sameDayInfo.sddRadioButtonDisabled,
            isSDUAddedToBasket,
            defaultSkuFrequency: sameDayInfo.defaultSkuFrequency,
            skuTrialEligibility: sameDayInfo.skuTrialEligibility,
            skuTrialPeriod: sameDayInfo.skuTrialPeriod,
            hasPickupMessage,
            signInText,
            forFreeShippingText
        };
    }
);

const functions = dispatch => ({
    triggerModalOpenAnalytics: isTrialAlreadyAdded => {
        SameDayUnlimitedBindings.trialModalOpen(isTrialAlreadyAdded);
    },
    showSignInModal: (...args) => {
        const action = showSignInModal(...args);
        dispatch(action);
    },
    mapDeliveryOptionToType
});

const withFulfillmentSectionProps = wrapHOC(connect(fields, functions));

export {
    fields, withFulfillmentSectionProps
};
