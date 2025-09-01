import OrderTotalSection from 'components/RwdCheckout/OrderSummary/OrderTotalSection/OrderTotalSection';
import withGlobalModals from 'hocs/withGlobalModals';
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

const getText = getLocaleResourceFile('components/RwdCheckout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');

const fields = createSelector(
    orderDetailsSelector,
    createStructuredSelector({
        youSave: getTextFromResource(getText, 'youSave'),
        sduSavingsUS: getTextFromResource(getText, 'sduSavingsUS'),
        sduSavingsCA: getTextFromResource(getText, 'sduSavingsCA'),
        withSDUUnlimited: getTextFromResource(getText, 'withSDUUnlimited'),
        gotIt: getTextFromResource(getText, 'gotIt'),
        shippingHandlingInfo: getTextFromResource(getText, 'shippingHandlingInfo'),
        free: getTextFromResource(getText, 'free'),
        andOtherFees: getTextFromResource(getText, 'andOtherFees'),
        pointsUsed: getTextFromResource(getText, 'pointsUsed'),
        pickupText: getTextFromResource(getText, 'pickupText'),
        bagFee: getTextFromResource(getText, 'bagFee'),
        specialFee: getTextFromResource(getText, 'specialFee'),
        estimatedTotal: getTextFromResource(getText, 'estimatedTotal'),
        pointsAfterPickup: getTextFromResource(getText, 'pointsAfterPickup'),
        placeOrder: getTextFromResource(getText, 'placeOrder'),
        tax: getTextFromResource(getText, 'tax'),
        shippingHandling: getTextFromResource(getText, 'shippingAndHandling')
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
            isSDUOnlyInSddBasket,
            getText
        };
    }
);

const withOrderTotalSectionProps = wrapHOC(connect(fields));

export default withGlobalModals(withOrderTotalSectionProps(OrderTotalSection));
