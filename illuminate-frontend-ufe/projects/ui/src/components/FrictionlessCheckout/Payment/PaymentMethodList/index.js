import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import PaymentMethodList from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaymentMethodList';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import checkoutUtils from 'utils/Checkout';
import orderUtils from 'utils/Order';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import {
    commonOrderToggleActions,
    updatePaymentActions,
    sectionSaveOrderAction,
    swapPaypalToCreditCard
} from 'components/FrictionlessCheckout/checkoutService/checkoutCommonActions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import checkoutApi from 'services/api/checkout';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import ErrorsUtils from 'utils/Errors';
import Location from 'utils/Location';
import store from 'store/Store';
import UtilActions from 'utils/redux/Actions';
import OrderActions from 'actions/OrderActions';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const localization = createStructuredSelector({
    expires: getTextFromResource(getText, 'expires'),
    storeCreditApplied: getTextFromResource(getText, 'storeCreditApplied'),
    storeCreditNotEnoughMessage: getTextFromResource(getText, 'storeCreditNotEnoughMessage'),
    accountCreditAltText: getTextFromResource(getText, 'accountCreditAltText')
});

const applePayFlowSelector = createSelector(orderSelector, order => order.isApplePayFlow);

const orderMergeAction = bankRewardsValidPaymentsMessage => {
    store.dispatch(UtilActions.merge('order', 'bankRewardsValidPaymentsMessage', bankRewardsValidPaymentsMessage));
};

const sectionSaveAction = (value, component, isUpdateOrder, isPaymentSectionComplete) => {
    store.dispatch(OrderActions.sectionSaved(value, component, isUpdateOrder, isPaymentSectionComplete));
};

const newCreditCardWithInterstice = (defaultPayment, creditCardOptions, showEditCreditCardForm) => {
    return (newCreditCard, label, component, saveSuccessCallback) =>
        decorators
            .withInterstice(checkoutApi.updateCreditCardOnOrder, INTERSTICE_DELAY_MS)(newCreditCard, label)
            .then(data => {
                if (data) {
                    orderMergeAction(data.bankRewardsValidPaymentsMessage);
                }

                swapPaypalToCreditCard();
                sectionSaveAction(Location.getLocation().pathname, component);
                refreshCheckout()().then(() => saveSuccessCallback());

                processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
                    data: {
                        paymentType: defaultPayment
                    }
                });
            })
            .catch(errorData => {
                if (Sephora.isAgent) {
                    //If it is Sephora mirror and the new credit card is expired then specific error is displayed for agents
                    const isCreditCardExpired = errorData.errorMessages.includes('Expired credit card.');

                    if (isCreditCardExpired) {
                        const selectedCreditCard = creditCardOptions.find(card => card.creditCardId === newCreditCard.creditCard.creditCardId);
                        showEditCreditCardForm({
                            ...selectedCreditCard,
                            isExpired: true,
                            expirationMonth: '',
                            expirationYear: ''
                        });
                    } else {
                        ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                    }
                } else {
                    ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                }
            });
};

const functions = {
    updatePaymentActions,
    commonOrderToggleActions,
    sectionSaveOrderAction,
    swapPaypalToCreditCard,
    utilMerge: UtilActions.merge,
    klarnaToggle: KlarnaActions.toggleSelect,
    afterPayToggle: AfterpayActions.toggleSelect,
    pazeToggle: PazeActions.toggleSelect,
    venmoToggle: VenmoActions.toggleSelect,
    afterPayResetError: AfterpayActions.resetError,
    setCheckoutSectionErrors: OrderActions.setCheckoutSectionErrors
};

const fields = createSelector(
    orderDetailsSelector,
    priceInfoSelector,
    applePayFlowSelector,
    paymentOptionsSelector,
    localization,
    (orderDetails, priceInfo, isApplePayFlow, paymentOptions, locales) => {
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isPayPalPayLaterEligible = orderDetails?.items?.isPayPalPayLaterEligible;
        const isGUestOrder = checkoutUtils.isGuestOrder();
        const payPalPaymentGroup = orderUtils.getPayPalPaymentGroup(orderDetails) || { isComplete: false };
        const hasSDUInBasket = orderUtils.hasSDUInBasket(orderDetails);
        const hasAutoReplenishItemInBasket = orderUtils.hasAutoReplenishItems(orderDetails);
        let shouldDisplayAddOrDeleteCreditCardButton = !isZeroCheckout || hasSDUInBasket || hasAutoReplenishItemInBasket;
        const giftCardPaymentGroups = orderUtils.getGiftCardPaymentGroups(orderDetails);
        const hasGiftCardInOrder = giftCardPaymentGroups.length < 2;

        if (Sephora.isAgent) {
            //If it is Sephora Mirror, agent should see add card button only if they are tier 3
            shouldDisplayAddOrDeleteCreditCardButton = Sephora.isAgentAuthorizedRole?.(['3']);
        }

        const isBopis = orderDetails?.header?.isBopisOrder;
        const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
        const gcAmountNotEnoughMessage = checkoutUtils.getGiftCardAmountNotEnoughMessage(orderDetails?.paymentGroups?.paymentMessages);
        const isCreditCardRequiredMessage = checkoutUtils.getCreditCardRequiredMessage(orderDetails?.paymentGroups?.paymentMessages);
        const isPaymentNotComplete = orderDetails?.paymentGroups?.paymentGroupsEntries?.some(
            paymentGroup => paymentGroup?.paymentGroup.isComplete === false
        );
        const isPaymentNotSelectedError =
            isPaymentNotComplete &&
            FrictionlessUtils.validatePaymentGroup(
                orderDetails?.paymentGroups?.paymentGroupsEntries,
                orderDetails?.paymentGroups?.paymentMessages?.[0],
                orderDetails?.header?.isComplete
            );

        const sectionErrors = {};
        sectionErrors[SECTION_NAMES.PAYMENT] = isPaymentNotSelectedError;

        return {
            orderDetails,
            priceInfo,
            isApplePayFlow,
            isZeroCheckout,
            paymentOptions,
            isPayPalPayLaterEligible,
            isGUestOrder,
            isPayPalSelected: payPalPaymentGroup.isComplete,
            shouldDisplayAddOrDeleteCreditCardButton,
            hasAutoReplenishItemInBasket,
            isBopis,
            creditCardPaymentGroup,
            newCreditCardWithInterstice,
            gcAmountNotEnoughMessage,
            isCreditCardRequiredMessage,
            locales,
            sectionErrors,
            hasGiftCardInOrder
        };
    }
);

const withPaymentMethodListToProps = wrapHOC(connect(fields, functions));

export default withPaymentMethodListToProps(PaymentMethodList);
