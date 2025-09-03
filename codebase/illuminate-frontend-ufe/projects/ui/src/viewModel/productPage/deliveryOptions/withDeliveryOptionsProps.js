import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import Actions from 'actions/Actions';
import basketConsts from 'constants/Basket';
import preferredStoreInfoSelector from 'selectors/user/preferredStoreInfoSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import { shipToHomeSelector } from 'selectors/page/product/fulfillmentOptions/deliveryOptions/shipToHome/shipToHomeSelector';
import skuUtils from 'utils/Sku';
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
import stringUtils from 'utils/String';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import { showEddOnProductPageSelector } from 'viewModel/selectors/testTarget/showEddOnProductPageSelector';
import { showBopisSelectorCopyOnPdpSelector } from 'viewModel/selectors/testTarget/showBopisSelectorCopyOnPdpSelector';
import { showReorderFulfillmentOptionsPdpSelector } from 'viewModel/selectors/testTarget/showReorderFulfillmentOptionsPdpSelector';
import { showSimplifyPickupSelector } from 'viewModel/selectors/testTarget/showSimplifyPickupSelector';
import { isUserSDUSubscriberSelector } from 'viewModel/selectors/user/isUserSDUSubscriberSelector';
import { isUserSDUTrialEligibleSelector } from 'viewModel/selectors/user/isUserSDUTrialEligibleSelector';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';

const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = localeUtils;
const { DELIVERY_OPTIONS } = basketConsts;
const { showMediaModal, showSignInModal } = Actions;
const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');

const sameDaySubTitleSelector = createSelector(
    (_state, ownProps) => ownProps.currentProduct,
    (_state, ownProps) => ownProps.sameDayAvailable,
    isUserSDUSubscriberSelector,
    isUserSDUTrialEligibleSelector,
    (product, sameDayAvailable, isUserSDUSubscriber, isUserSDUTrialEligible) => {
        const sddTilePromoMessage = product?.currentProductUserSpecificDetails?.sddTilePromoMessage;
        let subtitle = '';

        if (sddTilePromoMessage) {
            const isUserElegibleForSDDPromo = sameDayAvailable && (!isUserSDUSubscriber || isUserSDUTrialEligible);

            if (isUserElegibleForSDDPromo) {
                subtitle = sddTilePromoMessage;
            }
        }

        const { currentSku } = product;

        if (!currentSku.isSameDayEligibleSku) {
            subtitle = getText('sameDayDeliveryNotAvailable');
        }

        return subtitle;
    }
);

/* eslint-disable complexity */
const fields = createSelector(
    showSimplifyPickupSelector,
    basketSelector,
    userSubscriptionsSelector,
    (_state, ownProps) => ownProps.currentProduct,
    preferredStoreInfoSelector,
    (_state, ownProps) => ownProps.serviceUnavailable,
    createStructuredSelector({
        autoReplenishSubTitle: getTextFromResource(getText, 'autoReplenishSubTitle', ['{0}']),
        autoReplenishTitle: getTextFromResource(getText, 'autoReplenishTitle')
    }),
    shipToHomeSelector,
    showEddOnProductPageSelector,
    showBopisSelectorCopyOnPdpSelector,
    showReorderFulfillmentOptionsPdpSelector,
    sameDaySubTitleSelector,
    (
        simplifyPickup,
        basket,
        userSubscriptions,
        product,
        preferredStoreInfo,
        serviceUnavailable,
        textResources,
        shipToHome,
        showEddOnProductPage,
        showBopisSelectorCopyOnPdp,
        reorderFulfillmentOptionsPdp,
        sameDaySubTitle
    ) => {
        const { currentSku } = product;
        const {
            isSameDayEligibleSku, sameDayTitle, replenishmentAdjuster = '0', acceleratedPromotion, isOutOfStock
        } = currentSku;
        const shouldDisplayEdd = showEddOnProductPage && !isOutOfStock;
        const isOnlineOnly = skuUtils.isOnlineOnly(currentSku);
        const isGiftCard = skuUtils.isGiftCard(currentSku);
        const pickUpText = simplifyPickup?.challengerOne
            ? getText('freePickup')
            : simplifyPickup?.challengerTwo
                ? getText('pickup')
                : getText('buyOnlineAndPickUp');

        const bopisTitle = isGiftCard ? getText('availableInAllStores') : isOnlineOnly ? getText('onlineOnly') : pickUpText;
        const bopisSubTitle = !currentSku.isPickUpEligibleSku ? getText('pickUpNotOfferedForItem') : preferredStoreInfo?.displayName;
        const pickupMessage = product.pickupMessage;

        const hasPickupMessage = Boolean(
            pickupMessage?.includes(getText('readyTomorrow')) ||
                pickupMessage?.includes(getText('readyToday')) ||
                pickupMessage?.includes(getText('getItToday')) ||
                pickupMessage?.includes('recevez aujourd’hui')
        );

        const bopisCutoffSubTitle = pickupMessage?.includes(getText('readyTomorrow'))
            ? getText('getItTomorrow')
            : hasPickupMessage
                ? getText('readyWithinTwoHours')
                : bopisSubTitle;

        const isCustomSets = !!(skuUtils.isCustomSetsSingleSkuProduct(product) || skuUtils.isCustomSetsGroupedSkuProduct(product));
        const displayBopis = Sephora.configurationSettings.isBOPISEnabled;
        const shippingMethodNotAvailable =
            isGiftCard || isOnlineOnly || isCustomSets || skuUtils.isGwp(currentSku) || skuUtils.isSample(currentSku) || !isSameDayEligibleSku;
        const sduSubscriptions = userSubscriptions?.filter(subscription => subscription.type === 'SDU');
        const isUserSduTrialEligible = sduSubscriptions.length > 0 ? sduSubscriptions[0]?.isTrialEligible : true;
        const isReplenishmentEligible = currentSku?.isReplenishmentEligible;
        const autoReplenProductEligibility =
            product?.regularChildSkus?.length > 0
                ? product?.regularChildSkus.some(element => element?.isReplenishmentEligible)
                : isReplenishmentEligible;
        const isAutoReplenishmentEnabled = Sephora.configurationSettings.isAutoReplenishmentEnabled;
        const isAutoReplenishEmptyHubEnabled = !!Sephora.configurationSettings?.isAutoReplenishEmptyHubEnabled;
        const showAutoReplenishment = autoReplenProductEligibility && isAutoReplenishmentEnabled;
        const isSameDayShippingEnabled = Sephora.configurationSettings.isSameDayShippingEnabled;
        const sameDayTitleText = sameDayTitle || getText('sameDayDelivery');
        const sddRadioButtonDisabled = shippingMethodNotAvailable || serviceUnavailable;
        const getItShippedTitle = shouldDisplayEdd && shipToHome?.shipToHomeTitle ? shipToHome.shipToHomeTitle : getText('getItShippedTitle');

        const getItShippedSubTitle = shouldDisplayEdd && shipToHome?.shipToHomeMessage ? shipToHome.shipToHomeMessage : '';
        const { autoReplenishSubTitle, autoReplenishTitle, ...restTextResources } = textResources;
        const autoReplenishSubTitleText = stringUtils.format(autoReplenishSubTitle, Math.ceil(replenishmentAdjuster));
        const autoReplenishHotDeal = localeUtils.isFrench() ? 'Aubaine Autoprovision' : 'Auto-Replenish Hot Deal';
        const autoReplenishTitleText = acceleratedPromotion ? autoReplenishHotDeal : autoReplenishTitle;
        const subTitleAfterText = acceleratedPromotion ? getText('autoReplenishTermsApply') : '';
        const signInText = getText('signIn');
        const forFreeShippingText = getText('forFreeShipping');
        const location = Location.getLocation();
        const source = (urlUtils.getParamsByName('source', location.search) || [])[0];
        const shouldSelectAutoReplenish =
            isAutoReplenishEmptyHubEnabled && isReplenishmentEligible && source === DELIVERY_OPTIONS.AUTO_REPLENISH.toLowerCase();

        const DELIVERY_OPTIONS_ARRAY = [
            {
                deliveryOption: DELIVERY_OPTIONS.STANDARD,
                iconName: 'truck',
                title: userUtils.isAnonymous() ? getItShippedTitle : getText('freeShipping'),
                subTitle: getItShippedSubTitle
            },
            {
                deliveryOption: DELIVERY_OPTIONS.AUTO_REPLENISH,
                iconName: 'autoReplenish',
                title: autoReplenishTitleText,
                subTitle: `${autoReplenishSubTitleText}${subTitleAfterText}`,
                hideDeliveryOption: !showAutoReplenishment,
                bccMediaSpecInfo: 'autoReplenish',
                disabled: !isReplenishmentEligible
            },
            {
                deliveryOption: DELIVERY_OPTIONS.SAME_DAY,
                title: sameDayTitleText,
                subTitle: sameDaySubTitle,
                enableMarkdownSubtitle: true,
                iconName: 'bag',
                bccMediaSpecInfo: 'sameDay',
                hideDeliveryOption: !isSameDayShippingEnabled,
                disabled: sddRadioButtonDisabled
            }
        ];

        const bopisDeliveryOption = {
            deliveryOption: DELIVERY_OPTIONS.PICKUP,
            title: bopisTitle,
            subTitle: showBopisSelectorCopyOnPdp && currentSku.isPickUpEligibleSku ? bopisCutoffSubTitle : bopisSubTitle,
            iconName: 'store',
            disabled: !currentSku.isPickUpEligibleSku,
            preferredStoreInfo: preferredStoreInfo,
            currentProduct: product,
            hideDeliveryOption: !displayBopis,
            bccMediaSpecInfo: 'bopisStore'
        };

        if (reorderFulfillmentOptionsPdp) {
            DELIVERY_OPTIONS_ARRAY.unshift(bopisDeliveryOption);
        } else {
            DELIVERY_OPTIONS_ARRAY.push(bopisDeliveryOption);
        }

        return {
            ...restTextResources,
            simplifyPickup,
            basket,
            shippingMethodNotAvailable,
            isUserSduTrialEligible,
            sddRadioButtonDisabled,
            deliveryOptions: DELIVERY_OPTIONS_ARRAY,
            isSDUAddedToBasket: basket?.SDUProduct?.isSDUAddedToBasket,
            showBopisSelectorCopyOnPdp: showBopisSelectorCopyOnPdp && currentSku.isPickUpEligibleSku,
            hasPickupMessage,
            signInText,
            forFreeShippingText,
            shouldSelectAutoReplenish,
            reorderFulfillmentOptionsPdp
        };
    }
);

const functions = dispatch => ({
    showMediaModal: (...args) => {
        const action = showMediaModal(...args);
        dispatch(action);
    },
    triggerModalOpenAnalytics: isTrialAlreadyAdded => {
        SameDayUnlimitedBindings.trialModalOpen(isTrialAlreadyAdded);
    },
    showSignInModal: (...args) => {
        const action = showSignInModal(...args);
        dispatch(action);
    }
});

const withDeliveryOptionsProps = wrapHOC(connect(fields, functions));

export {
    fields, withDeliveryOptionsProps
};
