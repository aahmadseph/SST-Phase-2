import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ItemsInOrder from 'components/RwdCheckout/OrderSummary/ItemsInOrder/ItemsInOrder';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/OrderSummary/locales', 'OrderSummary');
const getAutoReplenText = resourceWrapper(getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions'), true);

const textResources = createStructuredSelector({
    shippingRestrictions: getTextFromResource(getText, 'shippingRestrictions'),
    freeReturns: getTextFromResource(getText, 'freeReturns'),
    onAllPurchases: getTextFromResource(getText, 'onAllPurchases'),
    qty: getTextFromResource(getText, 'qty'),
    removeText: getTextFromResource(getText, 'removeText'),
    deliveryEvery: getTextFromResource(getAutoReplenText, 'deliveryEvery'),
    autoReplenishCheckoutTermsConditions3: getTextFromResource(getAutoReplenText, 'autoReplenishCheckoutTermsConditions3')
});

const connectedItemsInOrder = connect(
    createSelector(textResources, texts => {
        return {
            ...texts,
            getAutoReplenText
        };
    })
);

const withItemsInOrderProps = wrapHOC(connectedItemsInOrder);

export default withItemsInOrderProps(ItemsInOrder);
