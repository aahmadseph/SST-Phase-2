export default function getResource(label) {
    const resources = {
        addNewCard: 'Add New Credit or Debit Card',
        editCreditCard: 'Edit Credit Card or Debit Card',
        cardNumberDisplay: 'Card Number',
        expirationMonth: 'Expiration Month',
        expirationYear: 'Expiration Year',
        save: 'Save',
        cancel: 'Cancel',
        setDefault: 'Set as my default card',
        cardNumberRequired: 'Credit card number required.',
        expirationMonthRequired: 'Expiration month required.',
        expirationYearRequired: 'Expiration year required.',
        update: 'Update',
        deleteCard: 'Delete Card',
        cardTypeTitle: 'Card Type',
        cardNumberTitle: 'Card Number',
        mm: 'MM',
        yy: 'YY',
        cvc: 'CVV/CVC',
        cardNumberIncorrect: 'There is a problem with your credit card information. Please verify or enter a different credit card.'
    };

    return resources[label];
}
