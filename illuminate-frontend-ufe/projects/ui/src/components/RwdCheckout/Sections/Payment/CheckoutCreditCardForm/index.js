import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import OrderActions from 'actions/OrderActions';
import CheckoutCreditCardForm from 'components/RwdCheckout/Sections/Payment/CheckoutCreditCardForm/CheckoutCreditCardForm';
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

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/CheckoutCreditCardForm/locales', 'CheckoutCreditCardForm');

const cardsAccepted = javascript.getObjectValuesSlowNDirty(OrderUtils.PAYMENT_TYPE.CREDIT_CARD);

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
    cancelButton: getTextFromResource(getText, 'cancelButton')
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
    merge: UtilActions.merge
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
                detectCardTypes
            };
        }),
        functions
    )
);

export default withComponentProps(CheckoutCreditCardForm);
