export default function getResource(label, vars = []) {
    const resources = {
        nameAll: 'All',
        nameOnlinePurchases: 'Online Purchases',
        nameStorePurchases: 'Store Purchases',
        nameRewardsGift: 'Rewards & Gift'
    };
    return resources[label];
}
