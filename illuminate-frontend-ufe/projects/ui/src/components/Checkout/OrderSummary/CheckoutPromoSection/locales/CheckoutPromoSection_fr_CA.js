export default function getResource (label) {
    const resources = {
        addPromoCode: 'Ajouter un code promotionnel',
        enterPromoRewards: 'Saisir la promo et les récompenses',
        addPromoOrRewardCode: 'Ajouter un code promotionnel ou de récompense'
    };
    return resources[label];
}
