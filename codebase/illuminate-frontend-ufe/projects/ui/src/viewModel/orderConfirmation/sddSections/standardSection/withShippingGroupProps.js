import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import orderLocaleSelector from 'selectors/order/orderDetails/header/orderLocale/orderLocaleSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const fields = createSelector(
    orderLocaleSelector,
    orderDetailsSelector,
    createStructuredSelector({
        viewOrderText: getTextFromResource(getText, 'viewOrderText'),
        viewOrderLink: getTextFromResource(getText, 'viewOrderLink'),
        mixedBasketGiftMessageStandard1: getTextFromResource(getText, 'mixedBasketGiftMessageStandard1'),
        mixedBasketGiftMessageStandard2: getTextFromResource(getText, 'mixedBasketGiftMessageStandard2')
    }),
    (orderLocale, orderDetails, textResources) => {
        const digitalGiftMessageEmail = orderDetails?.digitalGiftMsg?.email;

        return {
            ...textResources,
            orderLocale,
            digitalGiftMessageEmail
        };
    }
);

const withShippingGroupProps = wrapHOC(connect(fields));

export {
    withShippingGroupProps, fields
};
