import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ShippingAutoReplenishDeliveryInfoMessage from 'components/RwdCheckout/Shared/ShippingAutoReplenishDeliveryInfoMessage/ShippingAutoReplenishDeliveryInfoMessage';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile(
    'components/RwdCheckout/Shared/ShippingAutoReplenishDeliveryInfoMessage/locales',
    'ShippingAutoReplenishDeliveryInfoMessage'
);

const textResources = createStructuredSelector({
    shippingAutoReplenishMessage: getTextFromResource(getText, 'shippingAutoReplenishMessage')
});

const connectedShippingAutoReplenishDeliveryInfoMessage = connect(
    createSelector(textResources, ({ shippingAutoReplenishMessage }) => {
        return { shippingAutoReplenishMessage };
    })
);

const withShippingAutoReplenishDeliveryInfoMessageProps = wrapHOC(connectedShippingAutoReplenishDeliveryInfoMessage);

export default withShippingAutoReplenishDeliveryInfoMessageProps(ShippingAutoReplenishDeliveryInfoMessage);
