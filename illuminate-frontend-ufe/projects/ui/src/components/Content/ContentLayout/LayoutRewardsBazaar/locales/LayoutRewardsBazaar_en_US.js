export default function getResource(label) {
    const resources = {
        addFullSize: 'Add Full Size',
        addToBasket: 'Add to Basket',
        addToBasketShort: 'Add',
        remove: 'Remove',
        signInToAccess: 'Sign in to access',
        allRewards: 'All Rewards',
        exclusive: 'Exclusive',
        omniRewardsNotice: 'You can add Rewards Bazaar items to Same-Day or Store Pickup in basket. *Subject to availability'
    };
    return resources[label];
}
