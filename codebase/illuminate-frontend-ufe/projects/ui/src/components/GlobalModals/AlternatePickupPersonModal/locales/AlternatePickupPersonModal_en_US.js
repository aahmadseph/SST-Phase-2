export default function getResource (label, vars = []) {
    const resources = {
        alternatePickupPerson: 'Alternate Pickup Person',
        addAlternatePickup: 'Add an alternate pickup person',
        addedAlternatePickup: 'Alternate Pickup Person Added',
        addedAlternatePickupMsg: `${vars[0]} has been added as the alternate pickup person for this order.`,
        alternatePickup: 'Alternate Pickup Person',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        save: 'Save',
        saveAndContinue: 'Save & Continue',
        cancel: 'Cancel',
        edit: 'Edit',
        remove: 'Remove',
        ok: 'OK',
        addAltPickup: `To add an alternate pickup person, go to ${vars[0]}.`,
        updateAltPickup: `To modify or remove the alternate pickup person, go to ${vars[0]}.`,
        orderDetails: 'Order Details',
        removeAltPickupTitle: 'Remove alternate pickup person',
        removeAltPickupMessage: 'Are you sure you want to remove the alternate pickup person for this order?',
        cannotModifyMessage: 'Sorry, your order cannot be modified yet. Please wait at least one more minute and try again.',
        genericErrorMessage: 'Oops! Something went wrong and your order could not be modified. Please try again later.',
        pickupStore: 'Pickup Store',
        serviceSLA: 'Usually ready in 2 hours',
        inStorePickup: 'In-store pickup',
        curbSidePickup: 'Curbside pickup',
        confirmationDetails: 'Please have your <b>confirmation email</b> or <b>photo ID</b> ready when you pick up your order.'
    };
    return resources[label];
}
