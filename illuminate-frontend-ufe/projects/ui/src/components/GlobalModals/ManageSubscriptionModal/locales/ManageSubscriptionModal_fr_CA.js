export default function getResource(label, vars = []) {
    const resources = {
        manageSubscription: 'Gérer l’abonnement',
        qty: 'Qté',
        notRated: 'Aucune note',
        oneReview: 'Un commentaire',
        deliveryEvery: 'Livraison chaque',
        shippingAddress: 'Adresse de livraison',
        paymentMethod: 'Mode de paiement',
        deliveryFrequency: 'Fréquence de livraison',
        item: `ARTICLE ${vars[0]}`,
        chooseDeliveryFreq: 'Choisir la fréquence de livraison :',
        every: 'Chaque',
        mostCommon: 'Le plus courant',
        youWillSave: 'vous économiserez',
        annualyWithSubs: 'chaque année avec cet abonnement.',
        save: 'Enregistrer',
        cancel: 'Annuler',
        frequencyNumber: 'Nombre de fréquence',
        frequencyType: 'Type de fréquence',
        skip: 'Passer',
        pause: 'En pause',
        autoReplenishSummary: 'Sommaire du réapprovisionnement automatique',
        active: 'Actif',
        paused: 'En pause',
        viewShipments: 'Afficher les livraisons',
        biPointsEarned: 'Points Beauty Insider obtenus grâce au réapprovisionnement automatique',
        totalSaving: 'Économies totales sur le réapprovisionnement automatique',
        points: 'points',
        askToUpdateDelivery: 'Vous le voulez plus tôt? Mettez à jour votre fréquence de livraison.'
    };

    return resources[label];
}
