import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Apple from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Apple/Apple';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import orderUtils from 'utils/Order';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const localizationSelector = createStructuredSelector({
    payWithApplePay: getTextFromResource(getText, 'payWithApplePay')
});

const { wrapHOC } = FrameworkUtils;

const applePayFlowSelector = createSelector(orderSelector, order => order.isApplePayFlow);

const fields = createSelector(
    localizationSelector,
    orderDetailsSelector,
    applePayFlowSelector,
    (_ownState, ownProps) => ownProps.isNewUserFlow,
    (localization, orderDetails, isApplePayFlow) => {
        const isBopis = orderDetails?.header?.isBopisOrder;
        const isSdd = orderUtils.hasSameDayDeliveryItems(orderDetails);
        const hasAutoReplenishItem = orderUtils.hasAutoReplenishItems(orderDetails);

        return {
            orderDetails,
            isApplePayFlow,
            isBopis,
            isSdd,
            hasAutoReplenishItem,
            localization
        };
    }
);

const withPaymentMethodListToProps = wrapHOC(connect(fields, null));

export default withPaymentMethodListToProps(Apple);
