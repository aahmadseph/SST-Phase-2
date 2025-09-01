
export default function getResource(label, vars = []) {
    const resources = {
        availableForOne: 'Cet article n’est pas disponible pour d’autres options d’exécution.',
        availableForSomeButNotAll: 'Cet article n’est disponible que pour certaines options d’exécution. Veuillez consulter la page du produit pour voir vos options.',
        chooseMethod: 'Choisir une méthode',
        changeMethod: 'Changer la méthode',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        sameDayDelivery: 'Livraison le jour même',
        sameDayNotAvailable: 'Non disponible',
        selectForStoreAvailability: 'Sélectionner pour voir la disponibilité',
        for: 'pour',
        to: 'à',
        yourLocation: 'votre emplacement',
        changeLocation: 'Changer d’emplacement',
        getItShipped: 'Faites livrer',
        buyOnlineAndPickup: 'Achetez en ligne et ramassez en magasin',
        checkAvailability: 'Vérifiez la disponibilité',
        at: 'à',
        storesNearYou: 'magasins près de chez vous',
        checkOtherStores: 'Voir les autres magasins',
        autoReplenish: 'Réapprovisionnement automatique',
        enrollFromPDP: 'Veuillez vous inscrire à partir de la page du produit.',
        inStock: 'En stock',
        limitedStock: 'Quantités limitées',
        outOfStock: 'Rupture de stock',
        getItSooner: 'Obtenez-le plus rapidement',
        withSddOrBopis: 'avec la livraison le jour même ou l’option Achetez en ligne et ramassez',
        autoReplenishSwitchMessageNotice: 'Si vous passez à une autre méthode et que vous souhaitez utiliser le renouvellement automatique à nouveau, veuillez vous inscrire à partir de la page des détails du produit.'
    };

    return resources[label];
}
