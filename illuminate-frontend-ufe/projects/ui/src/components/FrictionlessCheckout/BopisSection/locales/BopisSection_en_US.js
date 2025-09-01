const resources = {
    pickupCardTitle: 'Pickup Info',
    pickupStore: 'Pickup Store',
    pickupPerson: 'Pickup Person',
    altPickupPerson: 'Alternate Pickup Person',
    confirmationDetails: 'Please have your <b>confirmation email</b> or <b>photo ID</b> ready when you pick up your order.',
    addAltPickupPerson: 'Add an alternate pickup person',
    usuallyReady: 'Usually ready in 2 hours',
    inStorePickup: 'In-store pickup',
    curbsidePickup: 'Curbside pickup',
    modalMessage: 'The store will hold your items for 5 days after you place your order. We’ll notify you via email when your order is ready for pickup, usually within 2 hours.',
    gotIt: 'Got it',
    edit: 'Edit',
    information: 'information',
    forThisOrderText: 'for this order',
    pickupConfirmationDetails: 'Pickup confirmation details',
    itemsToBePickedUp: 'Items to be picked up'
};

export default function getResource(label) {
    return resources[label];
}
