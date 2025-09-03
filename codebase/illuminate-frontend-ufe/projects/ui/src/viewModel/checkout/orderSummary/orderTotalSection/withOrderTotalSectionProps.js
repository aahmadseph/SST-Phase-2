import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import localeUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { isSDUOnlyOrder, hasSDUOnlyInSddBasket } = orderUtils;

const getText = getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');

const fields = createSelector(
    orderDetailsSelector,
    createStructuredSelector({
        youSave: getTextFromResource(getText, 'youSave'),
        sduSavingsUS: getTextFromResource(getText, 'sduSavingsUS'),
        sduSavingsCA: getTextFromResource(getText, 'sduSavingsCA'),
        withSDUUnlimited: getTextFromResource(getText, 'withSDUUnlimited')
    }),
    (orderDetails, { sduSavingsUS, sduSavingsCA, ...restTextResources }) => {
        const isCanada = localeUtils.isCanada();
        const sduSavings = isCanada ? sduSavingsCA : sduSavingsUS;
        const isSDUOrderOnly = isSDUOnlyOrder(orderDetails);
        const isSDUOnlyInSddBasket = hasSDUOnlyInSddBasket(orderDetails);

        return {
            ...restTextResources,
            sduSavings,
            isSDUOrderOnly,
            isSDUOnlyInSddBasket
        };
    }
);

const withOrderTotalSectionProps = wrapHOC(connect(fields));

export {
    withOrderTotalSectionProps, fields
};
