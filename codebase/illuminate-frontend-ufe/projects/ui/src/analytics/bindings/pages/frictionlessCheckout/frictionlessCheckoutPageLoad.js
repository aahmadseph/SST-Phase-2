/**
 * These are the bindings that will take place on the frictionless checkout page when the
 * page load event occurs.
 */
import store from 'Store';
import anaUtils from 'analytics/utils';
import userUtils from 'utils/User';
import FrictionlessUtils from 'utils/FrictionlessCheckout';

export default (function () {
    const frictionlessCheckoutPageLoadEvent = function () {
        let defaultPaymentMethodName = 'empty';
        const creditCards = store.getState().order?.paymentOptions?.creditCards;
        const defaultCreditCard = creditCards?.filter(creditCard => creditCard.isDefault)?.[0];

        if (defaultCreditCard) {
            defaultPaymentMethodName = anaUtils.getPaymentCardType(defaultCreditCard?.cardType);
        }

        digitalData.transaction.attributes.defaultPayment = defaultPaymentMethodName?.toLowerCase();

        const userInfo = userUtils.getBiAccountInfo();

        if (userInfo?.promotionPoints) {
            digitalData.transaction.attributes.availableBiPoints = userInfo.promotionPoints;
        }

        const appliedPromoCodes = FrictionlessUtils.getPromosData().promoCodes;

        if (appliedPromoCodes && appliedPromoCodes.length > 0) {
            digitalData.cart.promoCodes = appliedPromoCodes;
        }
    };

    return frictionlessCheckoutPageLoadEvent;
}());
