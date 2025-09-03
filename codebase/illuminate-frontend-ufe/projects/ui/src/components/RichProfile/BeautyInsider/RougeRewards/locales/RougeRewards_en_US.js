export default function getResource(label, vars = []) {
    const resources = {
        expires: `Expires ${vars[0]}`,
        apply: 'Apply in Basket',
        off: 'off',
        rougeRewards: 'Rouge Rewards',
        rougeRewardsAreNonrefundable: 'Rouge Rewards are nonrefundable. Any remaining rewards after redeption from this purchase will be lost.',
        youCanNowApply: 'You can now apply Rouge Rewards to your purchase for up to',
        availableRewards: 'Available Rewards',
        usePromoCode: `Use promo code *${vars[0]}* in-store`,
        toUseYourRewards: 'To use your Rewards in store, give the following promo code to the cashier at checkout:',
        viewLess: 'View less',
        viewMore: 'View more'
    };
    return resources[label];
}
