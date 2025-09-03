export default function getResource (label, vars = []) {
    const resources = {
        checkoutButton: 'Checkout',
        continueToCheckoutButton: 'Continue to Checkout',
        checkoutPickupItems: 'Checkout Pickup Items',
        checkoutShippedItems: 'Checkout Shipped Items'
    };
    return resources[label];
}
