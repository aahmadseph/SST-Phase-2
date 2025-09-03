export default function getResource(label, vars = []) {
    const resources = {
        changeStore: 'Changer de magasin',
        viewDetails: 'Voir les détails',
        myReservation: 'Mes réservations',
        beautyFAQ: 'FAQ sur le service beauté',
        getDirections: 'Obtenir l’itinéraire',
        findASephora: 'Trouver un magasin Sephora',
        happeningAtSephora: 'En cours chez Sephora',
        viewAll: 'Tout afficher',
        openUntil: `Ouvert jusqu’à ${vars[0]}`,
        closed: 'Fermé',
        noStoreNear: `Nous n’avons pas été en mesure de trouver un magasin près de « ${vars[0]} ».`,
        useStore: 'Utilisez ce magasin',
        chooseThisStore: 'Choisissez ce magasin',
        chooseYourStore: 'Choisissez votre magasin',
        chooseStore: 'Choisir un magasin',
        setYourLocation: 'Définir votre emplacement',
        pickupAndDelivery: 'Ramassage et livraison',
        pickupInStore: 'Ramassez en magasin',
        pickupNotOffered: 'Le ramassage n’est pas offert',
        showResults: 'Afficher les résultats',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        reservationNotOffered: 'Réservation non offerte',
        milesAway: ' kilomètres de distance',
        kmAway: ' kilomètres de distance',
        done: 'Terminé',
        ok: 'OK',
        changeStoreMessage: 'Le lieu de ramassage sera maintenant :',
        changeStoreMessage2: 'pour tous les articles à ramasser',
        anyPromosRewardsMsg:
            'De plus, toute promotion ou récompense dans votre panier d’articles à ramasser en sera retirée. Vous pouvez ajouter des promotions et des récompenses en magasin, s’il y a lieu.',
        changeItemQtyMsg: 'La quantité sera mise à jour à 1 pour tous les articles à ramasser.',
        changeItemQtyMsgHeader: 'Les articles achetés en ligne et ramassés en magasin sont limités à 1 par article dans les emplacements Kohl’s.',
        changeItemQtyMsgHeaderMoreThanOne: 'Votre panier d’articles à ramasser sera mis à jour.',
        goTo: 'Aller à ',
        kohlsCopy: ' ou visiter un magasin pour acheter. Les promotions et les récompenses Sephora peuvent ne pas s’appliquer dans les magasins Kohl’s.'
    };

    return resources[label];
}
