export default function getResource (label, vars = []) {
    const resources = {
        checkoutButton: 'Passer à la caisse',
        continueToCheckoutButton: 'Passer à la caisse',
        checkoutPickupItems: 'Articles à ramasser',
        checkoutShippedItems: 'Articles à faire livrer'
    };
    return resources[label];
}
