const resources = {
    endingIn: 'ending in',
    cardNumber: 'Card Number',
    mm: 'MM',
    yy: 'YY',
    cvc: 'Security Code',
    moreInfoPopover: 'More info about CVV',
    firstName: 'First Name',
    lastName: 'Last Name',
    billingAddress: 'Billing Address',
    useMyAddressRadio: 'Use my default delivery address',
    useMyBillingAddressRadio: 'Use my existing billing address',
    useDiffAddressRadio: 'Use a different address',
    saveCardCheckboxText: 'Save for future reservations and purchases',
    makeDefaultCheckboxText: 'Set as my default card',
    editCardTitle: 'Edit credit card or debit card',
    addNewCardTitle: 'Add new credit or debit card',
    cancel: 'Cancel',
    useThisCard: 'Use This Card',
    debitCardDisclaimer: 'Visa and Mastercard debit cards only',
    genericCreditCardApiError: 'We could not validate your credit card. Please re-enter your credit card information or try a different card.',
    creditCardNumberIncorrect: 'Credit Card number is incorrect'
};

export default function getResource(label) {
    return resources[label];
}
