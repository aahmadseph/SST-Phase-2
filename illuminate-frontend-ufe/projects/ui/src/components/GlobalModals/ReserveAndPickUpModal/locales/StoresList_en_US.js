export default function getResource(label, vars = []) {
    const resources = {
        pickupNotOffered: ' - Pickup not offered',
        openUntil: `Open until ${vars[0]}`,
        closed: 'Closed',
        milesAway: ' miles away',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        limitedStock: 'Limited Stock',
        payInStore: 'Pay in Store',
        payOnline: 'Pay Online',
        goTo: 'Go to ',
        kohlsCopy: ' or visit a store to purchase. Sephora promotions and rewards may not apply at Kohl\'s stores.',
        kmAway: ' kilometers away'
    };

    return resources[label];
}
