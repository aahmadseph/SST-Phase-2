export default function getResource (label, vars = []) {
    const resources = {
        checkout: 'Checkout',
        gotIt: 'Got It',
        rewardWarning: 'Promo/Reward Code Warning',
        checkoutIneligibleForSdd: 'This order type is not eligible for Rouge Rewards. Please remove your Rouge Rewards.'
    };

    return resources[label];
}
