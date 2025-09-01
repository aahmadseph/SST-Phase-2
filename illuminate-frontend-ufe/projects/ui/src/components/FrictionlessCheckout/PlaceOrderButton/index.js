import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PlaceOrderButton from 'components/FrictionlessCheckout/PlaceOrderButton/PlaceOrderButton';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import orderUtils from 'utils/Order';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import { showPlaceOrderTermsModal } from 'components/FrictionlessCheckout/checkoutActions/actionWrapper';
import anaUtils from 'analytics/utils';
import errorsSelector from 'selectors/errors/errorsSelector';
import ErrorConstants from 'utils/ErrorConstants';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/FrictionlessCheckout/PlaceOrderButton/locales', 'PlaceOrderButton');

const fieldErrorSelector = createSelector(errorsSelector, errors => errors.FIELD);

const textResources = createStructuredSelector({
    denialMessage: getTextFromResource(getText, 'denialMessage'),
    placeOrder: getTextFromResource(getText, 'placeOrder'),
    items: getTextFromResource(getText, 'items'),
    item: getTextFromResource(getText, 'item'),
    orderTotal: getTextFromResource(getText, 'orderTotal'),
    placeFreePayment: getTextFromResource(getText, 'placeFreePayment'),
    withText: getTextFromResource(getText, 'withText'),
    forProcessingText: getTextFromResource(getText, 'forProcessingText'),
    placeOrderFor: getTextFromResource(getText, 'placeOrderFor'),
    processingOrder: getTextFromResource(getText, 'processingOrder'),
    buttonDisabled: getTextFromResource(getText, 'buttonDisabled')
});

const functions = {
    showSDUAgreementModal: Actions.showSDUAgreementModal,
    setCheckoutSectionErrors: OrderActions.setCheckoutSectionErrors
};

const connectedPlaceOrderButton = connect(
    createSelector(
        textResources,
        orderDetailsSelector,
        paymentOptionsSelector,
        fieldErrorSelector,
        (texts, orderDetails, paymentOptions, fieldErrors) => {
            const { togglePlaceOrderDisabled } = OrderActions;
            const isAutoReplenishBasket = orderUtils.hasAutoReplenishItems(orderDetails) && Sephora.configurationSettings.isAutoReplenishmentEnabled;
            const defaultPayment = paymentOptions?.creditCards?.find(creditCard => creditCard?.isDefault);
            const isDefaultPaymentBeingUsed =
                !!defaultPayment &&
                orderDetails?.paymentGroups?.paymentGroupsEntries?.some(
                    payment => payment?.paymentGroup?.creditCardId === defaultPayment?.creditCardId
                );
            const defaultPaymentMethodName = anaUtils.getPaymentCardType(defaultPayment?.cardType)?.toLowerCase();

            return {
                ...texts,
                getText,
                togglePlaceOrderDisabled,
                showSDUAgreementModal: Actions.showSDUAgreementModal,
                isAutoReplenishBasket,
                showPlaceOrderTermsModal,
                originOfOrder: 'web',
                orderDetails,
                defaultPaymentMethodName,
                isDefaultPaymentBeingUsed,
                isCVVError: !!fieldErrors[ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE]
            };
        }
    ),
    functions
);

const withPlaceOrderButtonProps = wrapHOC(connectedPlaceOrderButton);

export default withPlaceOrderButtonProps(PlaceOrderButton);
