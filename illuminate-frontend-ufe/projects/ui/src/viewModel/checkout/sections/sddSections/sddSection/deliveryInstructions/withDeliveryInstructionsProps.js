import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import OrderActions from 'actions/OrderActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import OrderUtils from 'utils/Order';

const { wrapHOC } = FrameworkUtils;
const { saveDeliveryInstructions } = OrderActions;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Checkout/Sections/SddSections/SddSection/locales', 'SddSection');

const fields = createSelector(
    createStructuredSelector({
        addDeliveryInstructionsLinkText: getTextFromResource(getText, 'addDeliveryInstructions'),
        cancelLinkText: getTextFromResource(getText, 'cancelLinkText'),
        deliveryInstructionsHint: getTextFromResource(getText, 'deliveryInstructionsHint'),
        deliveryInstructionsLabel: getTextFromResource(getText, 'deliveryInstructions'),
        editLinkText: getTextFromResource(getText, 'editLinkText'),
        maxCharactersInfo: getTextFromResource(getText, 'maxCharactersInfo', ['{0}']),
        orderDeliveryNote: getTextFromResource(getText, 'orderDeliveryNote'),
        saveAndContinueText: getTextFromResource(getText, 'saveAndContinue')
    }),
    orderDetailsSelector,
    (textResources, orderDetails) => {
        const { deliveryInstructions = '' } = OrderUtils.getSameDayShippingGroup(orderDetails) || {};

        const newProps = {
            ...textResources,
            deliveryInstructions
        };

        return newProps;
    }
);

const functions = {
    saveDeliveryInstructions
};

const withDeliveryInstructionsProps = wrapHOC(connect(fields, functions));

export {
    withDeliveryInstructionsProps, fields, functions
};
