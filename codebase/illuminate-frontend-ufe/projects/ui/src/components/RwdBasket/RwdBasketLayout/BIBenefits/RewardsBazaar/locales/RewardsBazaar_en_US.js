export default function getResource(label, vars = []) {
    const resources = {
        title: 'Add Rewards Bazaar Items',
        applyBazaarPoints: 'Apply Points for Bazaar Items',
        getItShippedSubtitle: 'Get It Shipped',
        pickupSubtitle: 'Pickup',
        sameDaySubtitle: 'Same-Day Delivery',
        addedFor: 'added for',
        and: 'and',
        zeroAdded: '0 added',
        omniRewardsNotice: '<b>NEW!</b> You can now redeem reward items with Same-Day Delivery, Standard Shipping and Pickup orders*. Subject to inventory availability'
    };

    return resources[label];
}
