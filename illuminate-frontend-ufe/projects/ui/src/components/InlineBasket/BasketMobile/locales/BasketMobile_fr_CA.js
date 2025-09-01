export default function getResource(label, vars = []) {
    const resources = {
        close: 'Fermer',
        sddItemAddedModalTitle: 'Ajouté pour la livraison le jour même',
        bopisItemAddedModalTitle: 'Ajouté pour le ramassage',
        shippingItemAddedModalTitle: 'Ajouté pour la livraison',
        viewBasketAndReserve: 'Voir le panier et réserver',
        viewBasketAndCheckout: 'Voir le panier et passer à la caisse',
        ropisItemAdded: 'L’article a été ajouté à votre panier',
        pickUpAt: 'pour ramassage au ',
        sameDayDeliveryConfirmation: `L’article a été ajouté à votre panier pour ${vars[0]} à `,
        item: 'Article',
        items: 'Articles',
        qty: 'QTÉ',
        autoReplenishModalTitle: 'Ajouté pour le réapprovisionnement automatique',
        autoReplenishSuccessMessage: 'L’article a été ajouté et sera livré à chaque',
        autoReplenish: 'Réapprovisionnement automatique',
        sameDayDelivery: 'Livraison le jour même',
        standard: 'Standard',
        seeAll: 'Voir tous les',
        getBackToYourBasket: 'Retourner au panier',
        viewBasket: 'Voir le panier',
        viewBasketCheckout: 'Voir le panier et passer à la caisse',
        inStock: 'En stock',
        limitedStock: 'Quantités limitées',
        checkout: 'Passer à la caisse'
    };

    return resources[label];
}
