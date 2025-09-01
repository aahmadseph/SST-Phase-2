import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import EstimatedTotalSection from 'components/FrictionlessCheckout/CostSummary/EstimatedTotalSection/EstimatedTotalSection';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/CostSummary/locales', 'CostSummary');

const localization = createStructuredSelector({
    estimatedTotal: getTextFromResource(getText, 'estimatedTotal'),
    youSave: getTextFromResource(getText, 'youSave'),
    sduSavingsCA: getTextFromResource(getText, 'sduSavingsCA'),
    sduSavingsUS: getTextFromResource(getText, 'sduSavingsUS'),
    withSDUUnlimited: getTextFromResource(getText, 'withSDUUnlimited'),
    bopisTaxes: getTextFromResource(getText, 'bopisTaxes'),
    shippingAndTaxes: getTextFromResource(getText, 'shippingAndTaxes'),
    bopisIncreasedAuthorizationWarning: getTextFromResource(getText, 'bopisIncreasedAuthorizationWarning'),
    maxAuthAmountMessage: getTextFromResource(getText, 'maxAuthAmountMessage'),
    sddIncreasedAuthorizationWarning: getTextFromResource(getText, 'sddIncreasedAuthorizationWarning'),
    placeOrder: getTextFromResource(getText, 'placeOrder'),
    items: getTextFromResource(getText, 'items'),
    sddSubstituteDisclaimer: getTextFromResource(getText, 'sddSubstituteDisclaimer'),
    temporarilyAuthorized: getTextFromResource(getText, 'temporarilyAuthorized'),
    forText: getTextFromResource(getText, 'forText'),
    seeFullTerms: getTextFromResource(getText, 'seeFullTerms'),
    originalPrice: getTextFromResource(getText, 'originalPrice'),
    finalTotal: getTextFromResource(getText, 'finalTotal'),
    orderCostSummaryText: getTextFromResource(getText, 'orderCostSummaryText'),
    mobilePlaceOrderSection: getTextFromResource(getText, 'mobilePlaceOrderSection'),
    sameDayDeliveryAuthorizationNotice: getTextFromResource(getText, 'sameDayDeliveryAuthorizationNotice'),
    openNewWindowText: getTextFromResource(getText, 'openNewWindowText'),
    orderTotalAndPlaceOrderSection: getTextFromResource(getText, 'orderTotalAndPlaceOrderSection')
});

const fields = createSelector(localization, locales => {
    return {
        locales
    };
});

const withEstimatedTotalSectionProps = wrapHOC(connect(fields, null));

export default withEstimatedTotalSectionProps(EstimatedTotalSection);
