import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { ROOT_BASKET_TYPES } from 'constants/RwdBasket';
const { MAIN_BASKET, PRE_BASKET } = ROOT_BASKET_TYPES;

import { getCartComponentLists } from 'viewModel/rwdBasket/rwdBasketRoot/helpers/getCartComponentLists';
import { getTopContentMessageComponentList } from 'viewModel/rwdBasket/rwdBasketRoot/helpers/getTopContentMessageComponentList';
import { getBottomContentComponentList } from 'viewModel/rwdBasket/rwdBasketRoot/helpers/getBottomContentMessageComponentList';
import { getCmsInfoModalCallbacks } from 'viewModel/rwdBasket/rwdBasketRoot/helpers/getCmsInfoModalCallbacks';
import { showSwapGiftCardBiBenefitBasketSelector } from 'viewModel/selectors/testTarget/showSwapGiftCardBiBenefitBasketSelector';
import { isOmniRewardEnabledSelector } from 'viewModel/selectors/basket/isOmniRewardEnabled/isOmniRewardEnabledSelector';

import BasketPageSelector from 'selectors/page/rwdBasket/basketSelector';
const { basketPageSelector } = BasketPageSelector;

import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
import BasketUserDataSelector from 'selectors/page/rwdBasket/basketUserDataSelector';
const { basketUserDataSelector } = BasketUserDataSelector;
import availableRrcCouponsSelector from 'selectors/availableRrcCoupons/availableRrcCouponsSelector';
import ccTargetersSelector from 'selectors/page/rwdBasket/ccTargetersSelector';
import ccBannerSelector from 'selectors/creditCard/ccBannerSelector';

import rewardsSelector from 'selectors/rewards/rewardsSelector';
import promoSelector from 'selectors/promo/promoSelector';
import rwdCheckoutErrorsSelector from 'selectors/page/rwdBasket/checkoutErrorsSelector';
import { hideFreeSamplesOnBasketSelector } from 'viewModel/selectors/testTarget/hideFreeSamplesOnBasketSelector';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import { showQuantityPickerBasketSelector } from 'viewModel/selectors/testTarget/showQuantityPickerBasketSelector';
const {
    resetNavigation, goToPickUpBasket, goToDCBasket, goToPreBasket, resetScrollToTop, refreshBasket
} = RwdBasketActions;

import localeUtils from 'utils/LanguageLocale';
import RwdBasketUtils from 'utils/RwdBasket';
const {
    getCartInfo, getPaymentInfo, getMessageInfo, getBiBenefitsInfo, getGiftCardInfo
} = RwdBasketUtils;

const fields = createSelector(
    basketPageSelector,
    basketUserDataSelector,
    rewardsSelector,
    availableRrcCouponsSelector,
    ccTargetersSelector,
    promoSelector,
    rwdCheckoutErrorsSelector,
    ccBannerSelector,
    hideFreeSamplesOnBasketSelector,
    globalModalsSelector,
    showSwapGiftCardBiBenefitBasketSelector,
    isOmniRewardEnabledSelector,
    showQuantityPickerBasketSelector,
    (
        {
            basket,
            isInitialized: basketIsInitialized,
            shouldScrollToTop,
            currentRootBasketType,
            currentMainBasketType,
            isPreBasketAvailable,
            confirmationBoxOptions,
            cmsData
        },
        user,
        rewardsBazaarRewards,
        rougeRewardsCoupons,
        ccTargeters,
        promo,
        rwdCheckoutErrors,
        ccBanner,
        hideFreeSamplesOnBasket,
        globalModals,
        swapGiftCardBiBenefitBasket,
        isOmniRewardEnabled,
        showMoveBasketCheckoutButton,
        showQuantityPickerBasket
    ) => {
        if (!basketIsInitialized) {
            return { isInitialized: false };
        }

        // INFL-2347 - use remainToFreeShipping to calculate if Guest user has met threshold for free shipping threshold
        const hasMetFreeShippingThreshhold = basket.remainToFreeShipping == null;

        const cartInfo = getCartInfo({
            basket,
            user,
            confirmationBoxOptions,
            hasMetFreeShippingThreshhold,
            rwdCheckoutErrors
        });
        const messageInfo = getMessageInfo({ basket, pickupBasket: basket.pickupBasket, cartInfo });
        const infoModalCallbacks = getCmsInfoModalCallbacks(cmsData, globalModals);
        const bottomContentComponentList = getBottomContentComponentList(cmsData, basket);
        const isEmptyBasket = basket.itemCount === 0 && basket.pickupbasketItemCount === 0;
        const showForCanadaDesktop = localeUtils.isCanada() && !Sephora.isMobile();

        return {
            isInitialized: true,
            currentRootBasketType,
            currentMainBasketType,
            isPreBasketAvailable,
            cartComponentLists: getCartComponentLists({
                cartInfo,
                user,
                messageInfo: messageInfo[MAIN_BASKET],
                infoModalCallbacks: infoModalCallbacks[MAIN_BASKET],
                isOmniRewardEnabled,
                showQuantityPickerBasket
            }),
            cartInfo: {
                ...cartInfo,
                promo
            },
            paymentInfo: getPaymentInfo({
                basket,
                user,
                cartInfo,
                infoModalCallbacks: infoModalCallbacks[MAIN_BASKET],
                hasMetFreeShippingThreshhold
            }),
            messageInfo,
            bottomContentComponentList,
            biBenefitsInfo: getBiBenefitsInfo(
                {
                    basket,
                    user,
                    cmsData,
                    rougeRewardsCoupons,
                    infoModalCallbacks: infoModalCallbacks[MAIN_BASKET],
                    rewardsBazaarRewards,
                    ccTargeters,
                    biBenefitsPromos: promo,
                    ccBanner,
                    rwdCheckoutErrors,
                    isOmniRewardEnabled
                },
                hideFreeSamplesOnBasket
            ),
            giftCardInfo: getGiftCardInfo(cartInfo, cmsData),
            topContentMessageComponentList: getTopContentMessageComponentList({
                basket,
                user,
                cartInfo,
                cmsData,
                showBasketShippingAndPoints: !isEmptyBasket && !user.isSignedIn
            }),
            preBasketInfoModalCallbacks: infoModalCallbacks[PRE_BASKET],
            shouldScrollToTop,
            rwdCheckoutErrors,
            swapGiftCardBiBenefitBasket,
            showBasketGreyBackground: showForCanadaDesktop,
            showMoveBasketCheckoutButton: !isEmptyBasket ? showMoveBasketCheckoutButton : false
        };
    }
);

const functions = {
    resetNavigation,
    goToPickUpBasket,
    goToDCBasket,
    goToPreBasket,
    resetScrollToTop,
    refreshBasket
};

const withBasketRootProps = wrapHOC(connect(fields, functions));

export {
    withBasketRootProps, fields, functions
};
