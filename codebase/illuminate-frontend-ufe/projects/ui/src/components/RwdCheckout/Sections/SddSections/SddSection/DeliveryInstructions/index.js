import DeliveryInstructions from 'components/RwdCheckout/Sections/SddSections/SddSection/DeliveryInstructions/DeliveryInstructions';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import OrderActions from 'actions/OrderActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import OrderUtils from 'utils/Order';
import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { saveDeliveryInstructions } = OrderActions;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/SddSections/SddSection/locales', 'SddSection');

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
        const { deliveryInstructions = '' } = OrderUtils.getSameDayShippingGroup(orderDetails) || Empty.Object;

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

const ConnectedDeliveryInstructions = withDeliveryInstructionsProps(DeliveryInstructions);

export default ConnectedDeliveryInstructions;
