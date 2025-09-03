export default function getResource(label) {
    const resources = {
        signIn: 'Ouvrir une session',
        sigInToSeeItems: 'Ouvrez une session pour voir les articles que vous pourriez avoir ajoutés précédemment.',
        seeSamplesRewardsPromotions: 'Voir les échantillons, les récompenses et les promotions dans le',
        basket: 'panier',
        dcTotal: 'Expédition et livraison ',
        basketTotal: 'Sous-total ',
        reserveTotal: 'Réservation et ramassage ',
        bopisTotal: 'Achetez en ligne et ramassez en magasin ',
        checkout: 'Voir le panier et passer à la caisse',
        emptyBasket: 'Votre panier est vide.',
        item: 'article',
        or: 'ou',
        shopNewArrivals: 'Découvrir les nouveautés',
        viewAll: 'Tout afficher',
        freeShipping: 'Expédition gratuite',
        createAccount: 'Créer un compte',
        basketHeader: 'Expédition et livraison',
        reserveHeader: 'Réservation et ramassage',
        bopisHeader: 'Achetez en ligne et ramassez en magasin',
        sameDayDelivery: 'Livraison le jour même',
        standardDelivery: 'Faites livrer',
        autoreplenish: 'Réapprovisionnement automatique'
    };

    return resources[label];
}
