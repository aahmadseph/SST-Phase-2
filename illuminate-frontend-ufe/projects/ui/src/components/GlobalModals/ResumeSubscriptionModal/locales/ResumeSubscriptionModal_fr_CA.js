export default function getResource(label, vars = []) {
    const resources = {
        resumeSubscription: 'Reprendre l’abonnement',
        qty: 'Qté',
        deliveryEvery: 'Livraison chaque',
        shippingAddress: 'Adresse de livraison',
        paymentMethod: 'Mode de paiement',
        nextShipment: 'Prochaine livraison le',
        item: 'ARTICLE',
        resume: 'Reprendre',
        cancel: 'Annuler',
        editMessage: 'Vous pouvez apporter des modifications à votre abonnement après avoir repris les livraisons.',
        paymentMessage: 'En vous inscrivant, la carte de votre mode de paiement par défaut inscrit au dossier sera facturée.',
        notRated: 'Aucune note',
        oneReview: 'Un commentaire',
        yearlySavings: 'économies annuelles',
        firstYearSavings: 'économies pour la première année',
        lastDeliveryLeft: `livraison restante à ${vars[0]} % de réduction`,
        deliveriesLeft: `livraisons restantes à ${vars[0]} % de réduction`,
        discountValidUntil: `Réduction en vigueur jusqu’au ${vars[0]}`,
        discountsValidUntil: `Réductions en vigueur jusqu’au ${vars[0]}`
    };

    return resources[label];
}
