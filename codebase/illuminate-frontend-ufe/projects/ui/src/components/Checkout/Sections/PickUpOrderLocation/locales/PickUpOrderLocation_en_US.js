export default function getResource(label) {
    const resources = {
        storeDetails: 'Store Details',
        choosePickupMethod: 'Please choose a pickup method: ',
        inStorePickup: 'In-Store Pickup',
        curbsideConcierge: 'Curbside Concierge',
        errorTitle: 'Please try again later',
        ok: 'Okay'
    };

    return resources[label];
}
