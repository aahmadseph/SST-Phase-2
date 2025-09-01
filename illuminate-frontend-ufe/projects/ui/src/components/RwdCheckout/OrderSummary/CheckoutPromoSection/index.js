import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import CheckoutPromoSection from 'components/RwdCheckout/OrderSummary/CheckoutPromoSection/CheckoutPromoSection';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';

const { getTextFromResource, getLocaleResourceFile } = localeUtils;

const { wrapHOC } = FrameworkUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/OrderSummary/CheckoutPromoSection/locales', 'CheckoutPromoSection');

const textResources = createStructuredSelector({
    addPromoOrRewardCodeLabel: getTextFromResource(getText, 'addPromoOrRewardCode'),
    addPromoCodeLabel: getTextFromResource(getText, 'addPromoCode'),
    enterPromoRewardsLabels: getTextFromResource(getText, 'enterPromoRewards')
});

const connectedCheckoutPromo = connect(
    createSelector(orderDetailsSelector, textResources, (orderDetails, { addPromoOrRewardCodeLabel, addPromoCodeLabel, enterPromoRewardsLabels }) => {
        return {
            addPromoOrRewardCodeLabel,
            addPromoCodeLabel,
            enterPromoRewardsLabels,
            appliedPromotions: !Sephora.isDesktop() ? orderDetails.promotion?.appliedPromotions ?? [] : [],
            items: orderDetails.items?.items
        };
    })
);

const withCheckoutPromoSectionProps = wrapHOC(connectedCheckoutPromo);

export default withCheckoutPromoSectionProps(CheckoutPromoSection);
