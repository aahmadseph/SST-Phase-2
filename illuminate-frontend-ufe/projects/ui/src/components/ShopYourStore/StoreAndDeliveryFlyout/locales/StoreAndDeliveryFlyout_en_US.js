export default function getResource(label, vars = []) {
    const resources = {
        shopThisStore: 'Shop This Store',
        shopYourStore: 'Shop Your Store',
        shopSameDay: 'Shop Same-Day',
        shopSameDayDelivery: 'Shop Same-Day Delivery',
        sameDayDeliveryTo: 'Same-Day Delivery to',
        openUntil: `Open until ${vars[0]} today`,
        closed: 'Closed',
        storeDetails: 'Store details',
        findASephora: 'Find a Sephora',
        chooseStore: 'Choose Store',
        chooseStoreToBegin: 'Choose a store to begin.',
        chooseLocation: 'Choose Location',
        chooseLocationToBegin: 'Choose a location to begin.'
    };

    return resources[label];
}
