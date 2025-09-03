export default function getResource(label, vars = []) {
    const resources = {
        nameAll: 'Tous',
        nameOnlinePurchases: 'Achats en ligne',
        nameStorePurchases: 'Achat en magasin',
        nameRewardsGift: 'Récompenses et cadeaux'
    };
    return resources[label];
}
