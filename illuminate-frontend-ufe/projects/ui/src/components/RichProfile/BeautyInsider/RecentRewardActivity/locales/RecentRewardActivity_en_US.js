export default function getResource(label, vars = []) {
    const resources = {
        rewardsActivity: 'Rewards Redeemed',
        viewAll: 'View all',
        noRewardsYet: 'Your redeemed rewards will appear here.',
        browseLinkText: 'Browse The Rewards Bazaar'
    };

    return resources[label];
}
