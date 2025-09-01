export default function getResource(label, vars = []) {
    const resources = {
        title: 'Reprise du réapprovisionnement automatique',
        mainHeader: 'Vous êtes prêt',
        subHeader: 'Votre réapprovisionnement automatique a repris et les livraisons recommenceront le ',
        item: 'ARTICLE',
        qty: 'Qté',
        notRated: 'Aucune note',
        oneReview: 'Un commentaire',
        yearlySavings: 'économies annuelles',
        done: 'Terminé',
        firstYearSavings: 'économies pour la première année',
        lastDeliveryLeft: `livraison restante à ${vars[0]} % de réduction`,
        deliveriesLeft: `livraisons restantes à ${vars[0]} % de réduction`,
        discountValidUntil: `Réduction en vigueur jusqu’au ${vars[0]}`,
        discountsValidUntil: `Réductions en vigueur jusqu’au ${vars[0]}`
    };

    return resources[label];
}
