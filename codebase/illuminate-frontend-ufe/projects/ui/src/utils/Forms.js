const FORMS = {
    REGISTRATION_MODAL: 'registrationModal',
    SIGN_IN_MODAL: 'signInModal',
    PROFILE: {
        BILLING_ADDRESS: 'profileBillingAddress',
        ACCOUNT_ADDRESS: 'profileAccountAddress',
        POSTMAIL_PREF_ADDRESS: 'postMailPrefAddress'
    },
    CHECKOUT: {
        GIFT_WRAP_OPTION: 'checkoutGiftWrapOption',
        GIFT_WRAP_MESSAGE: 'checkoutGiftWrapMessage',
        GIFT_CARD_MESSAGE: 'checkoutGiftCardMessage',
        SHIPPING_ADDRESS: 'checkoutShippingAddress',
        BILLING_ADDRESS: 'checkoutBillingAddress',
        CREDIT_CARD: 'checkoutCreditCard',
        ACCOUNT_CREATION: 'checkoutAccountCreation',
        GIFT_CARD_FORM: 'checkoutGiftCardForm',
        PAYPAL_SAVE_CHECKBOX: 'paypalSaveToAccountCheckbox',
        BILLING_COUNTRIES_LIST: 'billingCountriesList'
    }
};

function getStoreEditSectionName(formName, isNewUserFlow) {
    return formName + (isNewUserFlow ? 'new' : '');
}

export default {
    getStoreEditSectionName,
    FORMS
};
