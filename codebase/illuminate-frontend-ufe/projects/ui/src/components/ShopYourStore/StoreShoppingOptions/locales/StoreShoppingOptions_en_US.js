export default function getResource(label) {
    const resources = {
        inStorePickup: 'In-Store Pickup',
        curbsidePickup: 'Curbside Pickup',
        beautyServices: 'Beauty Services',
        storeEvents: 'Store Events'
    };

    return resources[label];
}
