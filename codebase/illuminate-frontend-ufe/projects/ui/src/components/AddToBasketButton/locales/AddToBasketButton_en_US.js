export default function getResource(label, vars = []) {
    const resources = {
        addToBasket: 'Add to Basket',
        addAllToBasket: 'Add All to Basket',
        addedToBasket: 'Added to Basket',
        add: 'Add',
        added: 'Added',
        remove: 'Remove',
        exclusive: 'Exclusive',
        storePickup: 'for Store Pickup',
        standardShipping: 'Get It Shipped',
        sameDayDelivery: 'for Same-Day Delivery',
        sameDayCustomDelivery: `for ${vars[0]}`,
        autoReplenish: `Deliver every ${vars[0]}`,
        alreadyAddedKohls: 'Already Added to Basket',
        SameDay: 'from Same-Day',
        Pickup: 'from Pickup',
        ShipToHome: 'from Get It Shipped',
        itemShip: 'This item is not available in your country.',
        inBasket: 'in Basket'
    };
    return resources[label];
}
