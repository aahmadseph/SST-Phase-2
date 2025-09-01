import SDDInstructions from 'components/FrictionlessCheckout/DeliverTo/SDDInstructions/SDDInstructions';
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
const getText = getLocaleResourceFile('components/FrictionlessCheckout/DeliverTo/SDDInstructions/locales', 'SDDInstructions');

const fields = createSelector(
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        textInputLabel: getTextFromResource(getText, 'textInputLabel'),
        deliveryNote: getTextFromResource(getText, 'deliveryNote'),
        optional: getTextFromResource(getText, 'optional'),
        cancel: getTextFromResource(getText, 'cancel'),
        saveInstructions: getTextFromResource(getText, 'saveInstructions'),
        edit: getTextFromResource(getText, 'edit')
    }),
    orderDetailsSelector,
    (locales, orderDetails) => {
        const { deliveryInstructions = '' } = OrderUtils.getSameDayShippingGroup(orderDetails) || Empty.Object;

        return {
            locales,
            deliveryInstructions
        };
    }
);

const functions = {
    saveDeliveryInstructions
};

const withSDDInstructionsProps = wrapHOC(connect(fields, functions));

const ConnectedDeliveryInstructions = withSDDInstructionsProps(SDDInstructions);

export default ConnectedDeliveryInstructions;
