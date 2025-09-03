export default function getResource(label, vars = []) {
    const resources = {
        title: 'Ajouter des articles Rewards Bazaar®',
        applyBazaarPoints: 'Échanger des points pour des articles Rewards Bazaar®',
        getItShippedSubtitle: 'Faites livrer',
        pickupSubtitle: 'Ramassage',
        sameDaySubtitle: 'Livraison le jour même',
        addedFor: 'ajouté pour',
        and: 'et',
        zeroAdded: '0 ajouté',
        omniRewardsNotice: '<b>NOUVEAUTÉ!</b> Vous pouvez maintenant échanger des articles de récompense avec des commandes de livraison le jour même, d’expédition standard et de ramassage*. Sous réserve de la disponibilité des stocks'
    };

    return resources[label];
}
