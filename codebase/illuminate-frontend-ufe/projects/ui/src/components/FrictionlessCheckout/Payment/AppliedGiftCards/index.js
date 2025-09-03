import AppliedGiftCards from './AppliedGiftCards.f';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { orderSelector } from 'selectors/order/orderSelector';
import OrderUtils from 'utils/Order';
import checkoutApi from 'services/api/checkout';
import OrderActions from 'actions/OrderActions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import store from 'store/Store';
import ErrorsUtils from 'utils/Errors';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/AppliedGiftCards/locales', 'AppliedGiftCards');

const updateOrder = () => {
    checkoutApi
        .getOrderDetails(OrderUtils.getOrderId())
        .then(orderData => store.dispatch(OrderActions.updateOrder(orderData)))
        .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
};

const removeGiftCard = giftCard => {
    return () =>
        decorators
            .withInterstice(checkoutApi.removeGiftCard, INTERSTICE_DELAY_MS)(OrderUtils.getOrderId(), giftCard.paymentGroupId)
            .then(() => {
                updateOrder();
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
};

const showInfoModal = (title, message, confirmButtonText, callback) => {
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: title,
            message: message,
            buttonText: confirmButtonText,
            callback: callback,
            showCancelButton: true
        })
    );
};

const fields = createSelector(
    orderSelector,
    createStructuredSelector({
        giftCardLabel: getTextFromResource(getText, 'giftCardLabel'),
        hasBeenApplied: getTextFromResource(getText, 'hasBeenApplied'),
        applied: getTextFromResource(getText, 'applied'),
        removeLink: getTextFromResource(getText, 'removeLink'),
        removeGiftCardText: getTextFromResource(getText, 'removeGiftCardText'),
        areYouSureMessage: getTextFromResource(getText, 'areYouSureMessage')
    }),
    (order, textResources) => {
        const giftCardPaymentGroups =
            order?.orderDetails?.paymentGroups?.paymentGroupsEntries?.filter(
                group => group.paymentGroupType === OrderUtils.PAYMENT_GROUP_TYPE.GIFT_CARD
            ) || [];

        return {
            giftCardPaymentGroups,
            localization: textResources
        };
    }
);

const functions = {
    removeGiftCard,
    showInfoModal
};

const withAppliedGiftCardsProps = wrapHOC(connect(fields, functions));

export default withAppliedGiftCardsProps(AppliedGiftCards);
