export default function getResource (label) {
    const resources = {
        editBasket: 'Edit basket',
        hideOrderSummary: 'Hide Order Summary',
        showOrderSummary: 'Show Order Summary',
        itemsInOrder: 'Items in order',
        itemInOrder: 'Item in order',
        viewBasket: 'View basket',
        qty: 'Qty',
        removeText: 'Remove',
        shippingRestrictions: 'Shipping Restrictions',
        freeReturns: 'Free returns',
        onAllPurchases: 'on all purchases*',
        bopis: 'Pickup Items',
        shipped: 'Shipped Items',
        sameday: 'Same-Day Delivery Items',
        seeAll: 'See all',
        items: 'items'
    };
    return resources[label];
}
