import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PaymentSectionFooter from 'components/RwdCheckout/Sections/Payment/Section/PaymentSectionFooter/PaymentSectionFooter';
import localeUtils from 'utils/LanguageLocale';
import UtilActions from 'utils/redux/Actions';
import OrderActions from 'actions/OrderActions';
import store from 'store/Store';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import checkoutApi from 'services/api/checkout';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import ErrorsUtils from 'utils/Errors';
import Location from 'utils/Location';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const swapPaypalToCreditCard = () => {
    store.dispatch(OrderActions.swapPaypalToCredit());
};

const orderMergeAction = bankRewardsValidPaymentsMessage => {
    store.dispatch(UtilActions.merge('order', 'bankRewardsValidPaymentsMessage', bankRewardsValidPaymentsMessage));
};

const sectionSaveAction = (value, component, isUpdateOrder, isPaymentSectionComplete) => {
    store.dispatch(OrderActions.sectionSaved(value, component, isUpdateOrder, isPaymentSectionComplete));
};

const withInterstice = (method, payload, label) => {
    return decorators.withInterstice(method, INTERSTICE_DELAY_MS)(payload, label);
};

const newCreaditCardWithInterstice = (defaultPayment, creditCardOptions, showEditCreditCardForm) => {
    return (newCreditCard, label, component) =>
        decorators
            .withInterstice(checkoutApi.updateCreditCardOnOrder, INTERSTICE_DELAY_MS)(newCreditCard, label)
            .then(data => {
                if (data) {
                    orderMergeAction(data.bankRewardsValidPaymentsMessage);
                }

                swapPaypalToCreditCard();
                sectionSaveAction(Location.getLocation().pathname, component);

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

const updatePayPalCheckoutWithInterstice = paypalOption => {
    const payload = { details: { email: paypalOption?.email } };

    return (label, component) =>
        decorators
            .withInterstice(checkoutApi.updatePayPalCheckout, INTERSTICE_DELAY_MS)(payload, label)
            .then(() => {
                sectionSaveAction(Location.getLocation().pathname, component);

                processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
                    data: {
                        paymentType: 'paypal'
                    }
                });
            });
};

const getPaymentType = (...args) => {
    const paymentTypes = {
        isApplePayFlow: 'Apple Pay',
        isKlarnaFlow: 'Klarna',
        isAfterpayFlow: localeUtils.isUS() ? 'Cash App Afterpay' : 'Afterpay',
        isVenmoFlow: 'Venmo',
        isPazeFlow: 'Paze'
    };

    for (const flag in paymentTypes) {
        if (args[0][flag]) {
            return paymentTypes[flag];
        }
    }

    return '';
};

const functions = {
    orderMergeAction,
    sectionSaveAction
};

const connectedPlaceOrderButton = connect(
    createSelector(
        (_state, ownProps) => ownProps.isApplePayFlow,
        (_state, ownProps) => ownProps.isKlarnaFlow,
        (_state, ownProps) => ownProps.isAfterpayFlow,
        (_state, ownProps) => ownProps.isPazeFlow,
        (_state, ownProps) => ownProps.isVenmoFlow,
        (_state, ownProps) => ownProps.defaultPayment,
        (_state, ownProps) => ownProps.creditCardOptions,
        (_state, ownProps) => ownProps.showEditCreditCardForm,
        (_state, ownProps) => ownProps.paypalOption,
        (
            isApplePayFlow,
            isKlarnaFlow,
            isAfterpayFlow,
            isPazeFlow,
            isVenmoFlow,
            defaultPayment,
            creditCardOptions,
            showEditCreditCardForm,
            paypalOption
        ) => {
            const isCanada = localeUtils.isCanada();

            const paymentType = getPaymentType({
                isAfterpayFlow,
                isPazeFlow,
                isApplePayFlow,
                isKlarnaFlow,
                isVenmoFlow
            });

            return {
                isCanada,
                paymentType: getText('giftCardsNotCombinableText', [paymentType]),
                withInterstice,
                newCreaditCardWithInterstice: newCreaditCardWithInterstice(defaultPayment, creditCardOptions, showEditCreditCardForm),
                updatePayPalCheckoutWithInterstice: updatePayPalCheckoutWithInterstice(paypalOption)
            };
        }
    ),
    functions
);

const withPlaceOrderButtonProps = wrapHOC(connectedPlaceOrderButton);

export default withPlaceOrderButtonProps(PaymentSectionFooter);
