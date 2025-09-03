export default function getResource(label, vars = []) {
    const resources = {
        ends: `Prend fin ${vars[0]}`,
        apply: 'Appliquer dans le panier',
        off: 'de réduction',
        rougeRewards: 'Récompenses Rouge',
        rougeRewardsAreNonrefundable: 'Les récompenses Rouge ne sont pas remboursables. Toute récompense restante après l’échange de cet achat sera perdue.',
        youCanNowApply: 'Vous pouvez maintenant appliquer des récompenses Rouge à votre achat allant jusqu’à',
        availableRewards: 'Récompenses disponibles',
        usePromoCode: `Utiliser le code promotionnel *${vars[0]}* en magasin`,
        toUseYourRewards: 'Pour utiliser vos récompenses en magasin, remettre le code promotionnel suivant à la caisse :',
        viewLess: 'Voir moins',
        viewMore: 'Voir plus',
        storeRedemption: 'Échange en magasin',
        expires: `Expire le ${vars[0]}`,
        rougeBadge: 'EXCLUSIVITÉ ROUGE'
    };
    return resources[label];
}
