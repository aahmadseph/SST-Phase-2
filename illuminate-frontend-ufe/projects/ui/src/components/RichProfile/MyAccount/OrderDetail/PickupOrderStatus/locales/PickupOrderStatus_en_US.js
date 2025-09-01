export default function getResource(label, vars = []) {
    const resources = {
        statusLabel: 'Status',
        pickupWindowLabel: 'Pickup Window',
        pickupStoreLabel: 'Pickup Store',
        pickedUp: 'Picked Up',
        pickupPerson: 'Pickup Person',
        billingInfo: 'Billing Info',
        mapLink: 'Map',
        storeDetailsLink: 'Store Details',
        confirmationId: 'Please have your *confirmation email* or *photo ID* ready when you pick up your order.',
        seeFaqs: 'See FAQs'
    };

    return resources[label];
}
