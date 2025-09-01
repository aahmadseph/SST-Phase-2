import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import withGlobalModals from 'hocs/withGlobalModals';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import EstimatedTotalSection from 'components/FrictionlessCheckout/CostSummary/CostSummaryBreakdown/CostSummaryBreakdown';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/CostSummary/CostSummaryBreakdown/locales', 'CostSummaryBreakdown');

const localization = createStructuredSelector({
    merchandiseSubtotalText: getTextFromResource(getText, 'merchandiseSubtotalText'),
    pointsUsed: getTextFromResource(getText, 'pointsUsed'),
    discountsText: getTextFromResource(getText, 'discountsText'),
    free: getTextFromResource(getText, 'free'),
    tbdText: getTextFromResource(getText, 'tbdText'),
    shippingAndHandlingText: getTextFromResource(getText, 'shippingAndHandlingText'),
    autoReplenishSavings: getTextFromResource(getText, 'autoReplenishSavings'),
    gstHstText: getTextFromResource(getText, 'gstHstText'),
    taxText: getTextFromResource(getText, 'taxText'),
    pickup: getTextFromResource(getText, 'pickup'),
    bagFee: getTextFromResource(getText, 'bagFee'),
    pst: getTextFromResource(getText, 'pst'),
    storeCreditRedeemed: getTextFromResource(getText, 'storeCreditRedeemed'),
    giftCardRedeemed: getTextFromResource(getText, 'giftCardRedeemed'),
    eGiftCardRedeemed: getTextFromResource(getText, 'eGiftCardRedeemed'),
    creditCardPayment: getTextFromResource(getText, 'creditCardPayment'),
    payPalPayment: getTextFromResource(getText, 'payPalPayment'),
    otherFees: getTextFromResource(getText, 'otherFees'),
    information: getTextFromResource(getText, 'information'),
    moreInfo: getTextFromResource(getText, 'moreInfo')
});

const fields = createSelector(localization, locales => {
    return {
        locales
    };
});

const functions = {
    showMediaModal: Actions.showMediaModal
};

const withCostSummaryBreakdownProps = wrapHOC(connect(fields, functions));

export default withGlobalModals(withCostSummaryBreakdownProps(EstimatedTotalSection));
