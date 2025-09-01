export default function getResource(label) {
    const resources = {
        addFullSize: 'Ajouter le produit en format standard',
        addToBasket: 'Ajouter au panier',
        addToBasketShort: 'Ajouter',
        remove: 'Retirer',
        signInToAccess: 'Accéder au compte',
        allRewards: 'Toutes les récompenses',
        exclusive: 'Exclusivement',
        omniRewardsNotice: 'Vous pouvez ajouter des articles Rewards Bazaar® avec les commandes de livraison le jour même ou de ramassage en magasin à partir du panier. *Selon la disponibilité'
    };
    return resources[label];
}
