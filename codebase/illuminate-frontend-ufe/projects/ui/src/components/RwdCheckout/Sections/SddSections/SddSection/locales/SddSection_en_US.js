export default function getResource(label, vars = []) {
    const resources = {
        addDeliveryInstructions: 'Add delivery instructions',
        cancelLinkText: 'Cancel',
        deliveryInstructions: 'Delivery Instructions',
        deliveryInstructionsHint: 'Delivery Instructions (Optional)',
        editLinkText: 'Edit',
        maxCharactersInfo: `${vars[0]} / 250 characters`,
        orderDeliveryNote: 'We will leave your order at your door if you’re not around for the delivery.',
        saveAndContinue: 'Save & Continue',
        oosError: 'One or more items are now out of stock. Please go to your',
        oosBasket: 'basket',
        oosUpdate: 'and update your items.',
        deliveryWindowTitle: 'Schedule a Delivery Window',
        deliveryWindowUnavailable: 'Currently unavailable',
        chooseDifferentTime: 'Choose a different time',
        confirm: 'Confirm',
        ok: 'OK',
        errorTitle: 'Error',
        sameDayUnlimited: 'Same-Day Unlimited'
    };

    return resources[label];
}
