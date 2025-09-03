export default function getResource (label) {
    const resources = {
        editBasket: 'Modifier le panier',
        hideOrderSummary: 'Masquer le sommaire de la commande',
        showOrderSummary: 'Afficher le sommaire de la commande',
        itemsInOrder: 'Articles de la commande',
        itemInOrder: 'Article de la commande',
        viewBasket: 'Voir le panier',
        qty: 'Qté',
        removeText: 'Retirer',
        shippingRestrictions: 'Restrictions d’expédition',
        freeReturns: 'Retours gratuits',
        onAllPurchases: 'sur tous les achats.*',
        bopis: 'Articles à ramasser',
        shipped: 'Articles expédiés',
        sameday: 'Articles pour livraison le jour même',
        seeAll: 'Voir tous les',
        items: 'articles'
    };
    return resources[label];
}
