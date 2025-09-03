export default function getResource(label, vars = []) {
    const resources = {
        itemIsNoLongerAvailable: 'Item is no longer available',
        viewFullSize: 'View Full Size',
        shopTheBrand: 'Shop the Brand',
        viewDetails: 'View Details',
        itemShipToCanada: 'This item cannot be shipped to Canada',
        itemShipToUS: 'This item cannot be shipped to the United States',
        finalSaleItem: 'Final Sale: No returns or exchanges',
        redeemedOn: `Redeemed on ${vars[0]}`,
        noRewardsYet: 'Your redeemed rewards will appear here.',
        browseLinkText: 'Browse The Rewards Bazaar',
        rewardsActivity: 'Rewards Redeemed',
        viewAll: 'View all'
    };
    return resources[label];
}
