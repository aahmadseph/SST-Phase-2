import CreditCardArea from 'components/FrictionlessCheckout/Payment/CreditCard/CreditCardArea/CreditCardArea';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { connect } from 'react-redux';
import orderUtils from 'utils/Order';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import FormsUtils from 'utils/Forms';
import editDataSelector from 'selectors/editData/editDataSelector';
import creditCardUtils from 'utils/CreditCard';
import { commonOrderToggleActions } from 'components/FrictionlessCheckout/checkoutService/checkoutCommonActions';

const { wrapHOC } = FrameworkUtils;

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const localizationSelector = createStructuredSelector({
    addNewCreditCard: getTextFromResource(getText, 'addNewCreditCard'),
    debitCardDisclaimer: getTextFromResource(getText, 'debitCardDisclaimer')
});

const fields = createSelector(
    localizationSelector,
    orderDetailsSelector,
    paymentOptionsSelector,
    editDataSelector,
    (localization, orderDetails, paymentOptions, editData) => {
        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
        const shippingAddress =
            (hardGoodShippingGroup && hardGoodShippingGroup.address) || (physicalGiftCardShippingGroup && physicalGiftCardShippingGroup.address);
        const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
        const editStore = FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.CREDIT_CARD, true);
        const numberOfSavedCreditCards = creditCardUtils.numberOfSavedCards(paymentOptions.creditCards);
        const isBopisOrder = orderDetails?.header?.isBopisOrder;

        return {
            localization,
            shippingAddress: shippingAddress,
            defaultPayment: paymentOptions.defaultPayment,
            creditCardPaymentGroup,
            editStore,
            billingCountries: editData[FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST],
            numberOfSavedCreditCards,
            isBopisOrder,
            commonOrderToggleActions
        };
    }
);

const withPaymentProps = wrapHOC(connect(fields, null));

export default withPaymentProps(CreditCardArea);
