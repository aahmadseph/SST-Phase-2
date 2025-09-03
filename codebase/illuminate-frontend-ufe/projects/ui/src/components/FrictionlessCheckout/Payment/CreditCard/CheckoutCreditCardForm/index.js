import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import OrderActions from 'actions/OrderActions';
import CheckoutCreditCardForm from 'components/FrictionlessCheckout/Payment/CreditCard/CheckoutCreditCardForm/CheckoutCreditCardForm';
import checkoutApi from 'services/api/checkout';
import EditDataActions from 'actions/EditDataActions';
import UtilActions from 'utils/redux/Actions';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import OrderUtils from 'utils/Order';
import creditCardType from 'credit-card-type';
import javascript from 'utils/javascript';
import { refreshCheckout, getCreditCards } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import {
    commonOrderToggleActions,
    setNewCardActions,
    swapPaypalToCreditCard
} from 'components/FrictionlessCheckout/checkoutService/checkoutCommonActions';
import { PAYMENT_CARDS_DETECTED, UPDATE_ORDER, TOGGLE_CVC_INFO_MODAL } from 'constants/actionTypes/order';
import FormValidator from 'utils/FormValidator';
import store from 'store/Store';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const cardsAccepted = javascript.getObjectValuesSlowNDirty(OrderUtils.PAYMENT_TYPE.CREDIT_CARD);

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/CreditCard/CheckoutCreditCardForm/locales', 'CheckoutCreditCardForm');

const watchPaymentCardDetected = comp => {
    return store.watchAction(PAYMENT_CARDS_DETECTED, data => {
        const securityCode = comp.state.creditCard.securityCode || '';
        const cardType = data.cardTypes[0];

        if (cardType !== 'americanExpress' && securityCode.length > FormValidator.FIELD_LENGTHS.securityCode) {
            // cut extra CVV symbol
            comp.cardSecurityCodeInput.setValue(securityCode.substr(0, FormValidator.FIELD_LENGTHS.securityCode));
        }

        comp.setState({ cardType });

        const isMarkAsDefault = OrderUtils.isSephoraCardType({ cardType });

        if (!comp.props.isFirstCreditCard && !comp.props.isDefault && comp.state.isMarkAsDefault !== isMarkAsDefault) {
            comp.updateEditStore('isMarkAsDefault', isMarkAsDefault, true);
        }
    });
};

const watchUpdateOrder = comp => {
    return store.watchAction(UPDATE_ORDER, () => {
        if (!comp.isPaymentInOrderCompleteForGuestUser()) {
            comp.validateGuestCreditCard();
        } else {
            comp.props.togglePlaceOrderDisabled(false);
        }
    });
};

const watchToogleCVCModal = comp => {
    return store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
        const actionInfoButton = comp.cardSecurityCodeInput.getInfoActionButtonRef();

        if (actionInfoButton && data.isOpen === false) {
            actionInfoButton.focus();
        }
    });
};

const detectCardTypes = (cardNumber, paymentGroupType) => {
    let cardTypes = [];

    if (paymentGroupType === OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD) {
        if (!cardNumber) {
            return cardTypes;
        }

        const sephoraCardType = OrderUtils.detectSephoraCard(cardNumber);

        if (sephoraCardType) {
            cardTypes = cardTypes.concat(sephoraCardType);
        } else {
            cardTypes = cardTypes
                .concat(
                    creditCardType(cardNumber).map(cardInfo =>
                        cardInfo.type === 'unionpay' ? OrderUtils.PAYMENT_TYPE.CREDIT_CARD.discover : cardInfo.type
                    )
                )
                .filter(type => cardsAccepted.indexOf(type) >= 0);

            cardTypes = cardTypes.map(type => javascript.getKeyByValue(OrderUtils.PAYMENT_TYPE.CREDIT_CARD, type));
        }
    } else if (paymentGroupType) {
        cardTypes.push(javascript.getKeyByValue(OrderUtils.PAYMENT_TYPE.OTHER, paymentGroupType));
    }

    return cardTypes;
};

const checkAgentAware = comp => {
    if (Sephora.isAgent) {
        //If it is Sephora mirror and the new credit card is expired then specific error is displayed for agents
        Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, false);

        if (comp.state.creditCard.isExpired) {
            comp.showError('This card is expired. Please update your card information.');
            comp.cardMonthInput.current.showError('Please enter the month');
            comp.cardYearInput.current.showError('Please enter the year');
            comp.cardSecurityCodeInput.showError('Please enter your security code');
        }
    }
};

const localization = createStructuredSelector({
    mm: getTextFromResource(getText, 'mm'),
    yy: getTextFromResource(getText, 'yy'),
    cardNumberText: getTextFromResource(getText, 'cardNumber'),
    endingIn: getTextFromResource(getText, 'endingIn'),
    expirationDate: getTextFromResource(getText, 'expirationDate'),
    cvc: getTextFromResource(getText, 'cvc'),
    firstNameText: getTextFromResource(getText, 'firstName'),
    lastNameText: getTextFromResource(getText, 'lastName'),
    billingAddress: getTextFromResource(getText, 'billingAddress'),
    useMyAddressRadio: getTextFromResource(getText, 'useMyAddressRadio'),
    useDiffAddressRadio: getTextFromResource(getText, 'useDiffAddressRadio'),
    saveCardCheckboxText: getTextFromResource(getText, 'saveCardCheckboxText'),
    debitCardDisclaimer: getTextFromResource(getText, 'debitCardDisclaimer'),
    editCardTitle: getTextFromResource(getText, 'editCardTitle'),
    addNewCardTitle: getTextFromResource(getText, 'addNewCardTitle'),
    makeDefaultCheckboxText: getTextFromResource(getText, 'makeDefaultCheckboxText'),
    saveContinueButton: getTextFromResource(getText, 'saveContinueButton'),
    cancelButton: getTextFromResource(getText, 'cancelButton'),
    enterValidCardNumber: getTextFromResource(getText, 'enterValidCardNumber'),
    useThisCard: getTextFromResource(getText, 'useThisCard')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    openCVCModal: OrderActions.showCVCInfoModal,
    togglePlaceOrderDisabled: OrderActions.togglePlaceOrderDisabled,
    paymentCardNumberChanged: OrderActions.paymentCardNumberChanged,
    setPlaceOrderPreHook: OrderActions.setPlaceOrderPreHook,
    updateEditData: EditDataActions.updateEditData,
    clearEditData: EditDataActions.clearEditData,
    sectionSaved: OrderActions.sectionSaved,
    klarnaToggleSelect: KlarnaActions.toggleSelect,
    afterpayToggleSelect: AfterpayActions.toggleSelect,
    merge: UtilActions.merge,
    commonOrderToggleActions,
    setNewCardActions,
    swapPaypalToCreditCard,
    setCheckoutSectionErrors: OrderActions.setCheckoutSectionErrors,
    clearNamedSectionErrors: OrderActions.clearNamedSectionErrors
};

const withComponentProps = wrapHOC(
    connect(
        createSelector(fields, texts => {
            return {
                ...texts,
                updateCreditCardOnOrder: checkoutApi.updateCreditCardOnOrder,
                addCreditCardToOrder: checkoutApi.addCreditCardToOrder,
                addOrUpdateCreditCard: (creditCardInfo, typeOfUpdate, method) => {
                    return decorators.withInterstice(method, INTERSTICE_DELAY_MS)(creditCardInfo, typeOfUpdate);
                },
                detectCardTypes,
                refreshCheckout,
                watchPaymentCardDetected,
                watchUpdateOrder,
                watchToogleCVCModal,
                checkAgentAware,
                getCreditCards
            };
        }),
        functions
    )
);

export default withComponentProps(CheckoutCreditCardForm);
