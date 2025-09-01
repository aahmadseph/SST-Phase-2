export default function getResource(label, vars = []) {
    const resources = {
        title: 'From Rewards Bazaar',
        titleRouge: 'More Great Rewards',
        viewAll: 'View all',
        add: 'Add',
        rougeBadge: 'ROUGE',
        omniRewardsNotice: 'You can add Rewards Bazaar items to Same-Day or Store Pickup in basket. *Subject to availability'
    };
    return resources[label];
}
