export default function getResource(label, vars = []) {
    const resources = {
        title: 'Mettre l’article en pause',
        mainHeader: 'Êtes-vous certain de vouloir mettre en pause votre réapprovisionnement automatique? Vous pouvez reprendre à tout moment.',
        pause: 'En pause',
        cancel: 'Annuler',
        item: 'ARTICLE',
        qty: 'Qté',
        notRated: 'Aucune note',
        oneReview: 'Un commentaire',
        yearlySavings: 'économies annuelles',
        rememberMessage: `N’oubliez pas que vous avez jusqu’à ${vars[0]} réclamer votre ${vars[1]} ${vars[2]} % de réduction restant`,
        last: 'dernière',
        discount: 'réduction',
        discounts: 'réductions',
        firstYearSavings: 'économies pour la première année',
        lastDeliveryLeft: `livraison restante à ${vars[0]} % de réduction`,
        deliveriesLeft: `livraisons restantes à ${vars[0]} % de réduction`,
        discountValidUntil: `Réduction en vigueur jusqu’au ${vars[0]}`,
        discountsValidUntil: `Réductions en vigueur jusqu’au ${vars[0]}`

    };

    return resources[label];
}
