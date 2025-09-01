export default function getResource(label) {
    const resources = {
        qty: 'Quantity',
        inBasket: 'in basket',
        standardShipping: 'Get It Shipped',
        sdd: 'for Same-Day Delivery',
        bopis: 'for Store Pickup',
        basketUpdated: 'Basket Updated'
    };
    return resources[label];
}
