export default function getResource(label, vars = []) {
    const resources = {
        updatePaymentMethod: 'Update Payment Method',
        remove: 'Remove',
        edit: 'Edit',
        addNewCardTitle: 'Add new credit or debit card',
        cancel: 'Cancel',
        save: 'Save',
        cvc: 'CVV/CVC',
        updateSecurityCode: 'Please enter your security code.',
        CVCDescription: 'Please provide the CVV/CVC associated with your card to update your subscription.',
        gotIt: 'Got It',
        expiredCreditCardMsg: 'This card is expired. Please update your card information.'
    };

    return resources[label];
}
