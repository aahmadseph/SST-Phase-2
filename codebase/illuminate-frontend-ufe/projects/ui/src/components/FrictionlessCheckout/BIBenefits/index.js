import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import BIBenefits from 'components/FrictionlessCheckout/BIBenefits/BIBenefits';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/BIBenefits/locales', 'BIBenefits');

import { ROOT_BASKET_TYPES, MAIN_BASKET_TYPES } from 'constants/RwdBasket';
const { MAIN_BASKET } = ROOT_BASKET_TYPES;
import { isOmniRewardEnabledSelector } from 'viewModel/selectors/basket/isOmniRewardEnabled/isOmniRewardEnabledSelector';
import { getCmsInfoModalCallbacks } from 'viewModel/rwdBasket/rwdBasketRoot/helpers/getCmsInfoModalCallbacks';

import BasketPageSelector from 'selectors/page/rwdBasket/basketSelector';
const { basketPageSelector } = BasketPageSelector;

import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
import BasketUserDataSelector from 'selectors/page/rwdBasket/basketUserDataSelector';
const { basketUserDataSelector } = BasketUserDataSelector;
import availableRrcCouponsSelector from 'selectors/availableRrcCoupons/availableRrcCouponsSelector';
import ccTargetersSelector from 'selectors/page/rwdBasket/ccTargetersSelector';
import rewardsSelector from 'selectors/rewards/rewardsSelector';
import promoSelector from 'selectors/promo/promoSelector';
import rwdCheckoutErrorsSelector from 'selectors/page/rwdBasket/checkoutErrorsSelector';
import RwdBasketUtils from 'utils/RwdBasket';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { checkoutCCBanner } from 'utils/ccBanner';
import checkoutUtils from 'utils/Checkout';
import orderErrorsSelector from 'selectors/order/orderErrorsSelector';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { getBiBenefitsInfo } = RwdBasketUtils;

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    enterPromoCode: getTextFromResource(getText, 'enterPromoCode'),
    rougeBadge: getTextFromResource(getText, 'rougeBadge')
});

const functions = {
    showContentModal: Actions.showContentModal
};

const fields = createSelector(
    basketPageSelector,
    basketUserDataSelector,
    rewardsSelector,
    availableRrcCouponsSelector,
    ccTargetersSelector,
    promoSelector,
    rwdCheckoutErrorsSelector,
    globalModalsSelector,
    isOmniRewardEnabledSelector,
    p13nSelector,
    coreUserDataSelector,
    orderErrorsSelector,
    localization,
    (_ownState, ownProps) => ownProps,
    (
        { basket },
        user,
        rewardsBazaarRewards,
        rougeRewardsCoupons,
        ccTargeters,
        promo,
        rwdCheckoutErrors,
        globalModals,
        isOmniRewardEnabled,
        p13n,
        coreUserData,
        sectionErrors,
        locale,
        { biBenifits, isBopisOrder, biBenefitsModals }
    ) => {
        const infoModalCallbacks = getCmsInfoModalCallbacks(biBenefitsModals, globalModals);
        const basketType = isBopisOrder ? MAIN_BASKET_TYPES.BOPIS_BASKET : MAIN_BASKET_TYPES.DC_BASKET;
        const ccBanner = checkoutCCBanner(p13n, coreUserData, biBenifits);
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const sectionLevelError = sectionErrors?.[SECTION_NAMES.BI_BENEFITS]?.length && sectionErrors?.[SECTION_NAMES.BI_BENEFITS];

        return {
            localization: locale,
            basketType,
            isGuestCheckout,
            biBenefitsInfo: getBiBenefitsInfo({
                basket,
                user,
                cmsData: { biBenifits },
                rougeRewardsCoupons,
                infoModalCallbacks: infoModalCallbacks[MAIN_BASKET],
                rewardsBazaarRewards,
                ccTargeters,
                biBenefitsPromos: promo,
                ccBanner,
                rwdCheckoutErrors,
                isOmniRewardEnabled,
                isCheckout: true
            }),
            getText,
            sectionLevelError
        };
    }
);

const withBIBenefitsProps = wrapHOC(connect(fields, functions));

export default withBIBenefitsProps(BIBenefits);
