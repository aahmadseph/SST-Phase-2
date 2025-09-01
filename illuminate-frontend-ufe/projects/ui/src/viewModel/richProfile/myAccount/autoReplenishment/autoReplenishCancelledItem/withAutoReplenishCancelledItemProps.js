import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import basketUtils from 'utils/Basket';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import dateUtils from 'utils/Date';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { wrapHOC } = FrameworkUtils;
const { formatCurrency } = DeliveryFrequencyUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AutoReplenishment/locales', 'AutoReplenishment');

const localization = createStructuredSelector({
    viewProductDetails: getTextFromResource(getText, 'viewProductDetails'),
    cancelledOn: getTextFromResource(getText, 'cancelledOn', ['{0}']),
    discountRate: getTextFromResource(getText, 'discountRate', ['{0}'])
});

const fields = createSelector(
    localization,
    (_state, ownProps) => ownProps.item,
    (_state, ownProps) => ownProps.subscription,
    (textResources, item, subscription) => {
        const displayItemVariation = !!item.variationType && !!item.variationValue && !!item.skuId;
        const listPrice = item && formatCurrency(parseFloat(basketUtils.removeCurrency(item.price)), item.qty);
        const subscriptionEndDate = subscription.subscriptionEndDate ? dateUtils.formatStringDateToMMDDYY(subscription.subscriptionEndDate) : null;
        const discountRate = parseFloat(item.discountAmount);

        return {
            localization: textResources,
            displayItemVariation,
            listPrice,
            discountRate,
            subscriptionEndDate
        };
    }
);

const functions = null;

const withAutoReplenishCancelledItemProps = wrapHOC(connect(fields, functions));

export {
    withAutoReplenishCancelledItemProps, fields, functions, localization
};
