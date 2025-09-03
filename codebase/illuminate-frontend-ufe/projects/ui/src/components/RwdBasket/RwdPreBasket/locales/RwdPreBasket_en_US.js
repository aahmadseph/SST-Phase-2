export default function getResource(label, vars = []) {
    const resources = {
        mainTitle: 'Your Baskets',
        bopisTitle: `Buy Online and Pick Up (${vars[0]})`,
        bopisPromo: 'Qualifying promos and rewards can be added on the next screen.',
        bopisSubtotal: 'Pickup Items Subtotal',
        shippingTitle: `Shipping and Delivery (${vars[0]})`,
        shippingPromo: 'Promos, rewards, and samples can be added on the next screen.',
        shippingSubtotal: 'Shipped Items Subtotal',
        linkText: 'View Basket',
        linkMessage: 'There are no items in your shipping basket.',
        sameDayDelivery: 'Same-Day Delivery'

    };
    return resources[label];
}
