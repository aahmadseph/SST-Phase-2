export default function getResource(label, vars = []) {
    const resources = {
        edit: 'Edit',
        add: 'Add',
        addCreditCard: 'Add Credit or Debit Card',
        editCreditCard: 'Edit Credit or Debit Card',
        cardType: 'Card Type',
        cardTypeRequired: 'Card type required.',
        cardNumber: 'Card Number',
        cardNumberRequired: 'Credit card number required.',
        mm: 'MM',
        yy: 'YY',
        cvc: 'CVV/CVC',
        moreInfoCvc: 'More info about CVV',
        expirationMonth: 'Expiration Month',
        expirationMonthRequired: 'Expiration month required.',
        expirationYear: 'Expiration Year',
        expirationYearRequired: 'Expiration year required.',
        setAsDefaultCreditCard: 'Set as my default card',
        deleteCreditCard: 'Delete card',
        cancel: 'Cancel',
        update: 'Update',
        save: 'Save',
        areYouSureYouWouldLikeToDelete: 'Are you sure you would like to permanently delete your card?',
        yes: 'Yes',
        no: 'No',
        debitCardDisclaimer: 'Visa and Mastercard debit cards only',
        accountUpdateModal: 'Account Update',
        deleteDefaultCardErrorModal: 'Unable to delete this card at the moment. Please try again later.',
        done: 'Done'
    };
    return resources[label];
}
