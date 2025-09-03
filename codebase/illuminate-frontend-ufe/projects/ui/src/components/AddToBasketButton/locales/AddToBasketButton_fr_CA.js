export default function getResource(label, vars = []) {
    const resources = {
        addToBasket: 'Ajouter au panier',
        addAllToBasket: 'Tout ajouter au panier',
        addedToBasket: 'Ajouté au panier',
        add: 'Ajouter',
        added: 'Ajouté',
        remove: 'Retirer',
        exclusive: 'Exclusivement',
        storePickup: 'pour le ramassage en magasin',
        standardShipping: 'Faites livrer',
        sameDayDelivery: 'pour la livraison le jour même',
        sameDayCustomDelivery: `pour ${vars[0]}`,
        autoReplenish: `Livrer chaque ${vars[0]}`,
        alreadyAddedKohls: 'Déjà ajouté au panier',
        SameDay: 'de la livraison le jour même',
        Pickup: 'du ramassage',
        ShipToHome: 'des articles à expédier',
        itemShip: 'Désolé, cet article n’est pas offert dans votre pays.',
        inBasket: 'dans le panier'
    };
    return resources[label];
}
