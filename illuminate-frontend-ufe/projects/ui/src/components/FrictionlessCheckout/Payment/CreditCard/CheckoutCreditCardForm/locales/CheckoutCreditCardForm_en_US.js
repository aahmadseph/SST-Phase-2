const resources = {
    endingIn: 'ending in',
    cardNumber: 'Card Number',
    mm: 'MM',
    yy: 'YY',
    cvc: 'CVV/CVC',
    moreInfoPopover: 'More info about CVV',
    firstName: 'First Name',
    lastName: 'Last Name',
    billingAddress: 'Billing Address',
    useMyAddressRadio: 'Use my shipping address',
    useDiffAddressRadio: 'Use a different address',
    saveCardCheckboxText: 'Save this card for future purchases',
    makeDefaultCheckboxText: 'Set as my default card',
    editCardTitle: 'Edit credit card or debit card',
    addNewCardTitle: 'Add new credit or debit card',
    cancelButton: 'Cancel',
    saveContinueButton: 'Save & Continue',
    debitCardDisclaimer: 'Visa and Mastercard debit cards only',
    expirationDate: 'Exp MM/YY',
    enterValidCardNumber: 'Please enter a valid card number.',
    useThisCard: 'Use This Card'
};

export default function getResource(label) {
    return resources[label];
}
