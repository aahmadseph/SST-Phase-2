export default function getResource (label) {
    const resources = {
        addPromoCode: 'Add promo code',
        enterPromoRewards: 'Enter Promo & Rewards',
        addPromoOrRewardCode: 'Add promo or reward code'
    };
    return resources[label];
}
