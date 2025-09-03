import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import dateUtils from 'utils/Date';
import PreviouslyPurchased from 'components/ProductPage/PreviouslyPurchased/PreviouslyPurchased';
import completePurchaseHistorySelector from 'selectors/completePurchaseHistory/completePurchaseHistorySelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/ProductPage/PreviouslyPurchased/locales', 'PreviouslyPurchased');

const textResources = createStructuredSelector({
    purchased: getTextFromResource(getText, 'purchased'),
    time: getTextFromResource(getText, 'time'),
    times: getTextFromResource(getText, 'times'),
    lastPurchase: getTextFromResource(getText, 'lastPurchase')
});

const fields = createSelector(
    textResources,
    completePurchaseHistorySelector,
    (_state, ownProps) => ownProps.productId,
    (locales, purchaseHistory, productId) => {
        const previousPurchaseData = userUtils.getPreviousPurchaseData(purchaseHistory, productId);

        if (!previousPurchaseData) {
            return { locales, showSkeleton: true };
        }

        const formattedLastPurchase = dateUtils.formatDateMDY(new Date(previousPurchaseData.lastPurchase).toISOString(), true, false, true);

        return {
            locales,
            frequency: previousPurchaseData.frequency,
            lastPurchase: formattedLastPurchase,
            variationType: previousPurchaseData.variationType,
            variationTypeDisplayName: previousPurchaseData.variationTypeDisplayName,
            variationValue: previousPurchaseData.variationValue,
            variationDesc: previousPurchaseData.variationDesc
        };
    }
);

const withPreviouslyPurchasedProps = wrapHOC(connect(fields, null));

export default withPreviouslyPurchasedProps(PreviouslyPurchased);
