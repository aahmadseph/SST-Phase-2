export default function getResource(label, vars = []) {
    const resources = {
        item: 'ARTICLE',
        items: 'articles',
        qty: 'QTÉ',
        basketSubtotal: 'Sous-total du panier',
        subTotal: 'Sous-total',
        continue: 'Continuer à magasiner',
        seeSamples: 'Voir les échantillons, récompenses et promotions dans le',
        basket: 'panier',
        standardTitle: 'Ajouté pour la livraison',
        sddTitle: 'Ajouté pour la livraison le jour même',
        reserveTitle: `Ajouté pour le ramassage à ${vars[0]}`,
        autoReplenishTitle: 'Ajouté pour le réapprovisionnement automatique',
        proceedToBasket: 'Passer au panier',
        viewInBasket: 'Voir dans le panier',
        viewAndCheckout: 'Voir le panier et passer à la caisse',
        viewAndReserve: 'Voir le panier et réserver',
        testSeeDetails: 'Voir les détails',
        mostCommon: 'le plus courant',
        deliverEvery: 'Livrer chaque',
        weeksShort: 'semaines',
        monthsShort: 'mois',
        months: 'mois',
        weeks: 'semaines',
        urgencyMessage: 'IL N’EN RESTE QUE QUELQUES-UNS : PASSEZ BIENTÔT À LA CAISSE',
        viewBasket: 'Voir le panier',
        limitedStock: 'Quantités limitées',
        inStock: 'En stock',
        at: 'à',
        for: 'pour',
        checkout: 'Passer à la caisse'
    };

    return resources[label];
}
