const resources = {
    inStoreShopping: 'In-Store Shopping',
    inStorePickup: 'In-Store Pickup',
    curbside: 'Curbside Pickup',
    beautyServices: 'Beauty Services',
    storeEvents: 'Store Events'
};

export default function getResource(label) {
    return resources[label];
}
