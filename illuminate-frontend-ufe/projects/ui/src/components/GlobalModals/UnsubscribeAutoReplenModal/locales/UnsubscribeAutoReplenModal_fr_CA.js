export default function getResource(label, vars = []) {
    const resources = {
        title: 'Se désabonner',
        unsubscribeSubHeader: 'Voulez-vous vous désabonner de votre abonnement?',
        youHaveSaved: 'vous avez économisé',
        since: 'depuis',
        youWillSave: 'Vous économiserez',
        nextYear: 'au cours de la prochaine année grâce à cet abonnement.',
        qty: 'Qté',
        yearlySavings: 'économies annuelles',
        nevermindCTA: 'Ce n’est pas grave',
        unsubscribeCTA: 'Se désabonner',
        item: `ARTICLE ${vars[0]}`,
        skipNextDelivery: 'Sauter plutôt la prochaine livraison',
        cancellingWillForfeit: 'L’annulation entraînera la perte de votre',
        last: 'dernière',
        limitedTime: 'offre à durée limitée de',
        percentageOff: `${vars[0]} % de réduction`,
        discount: 'réduction',
        discounts: 'réductions',
        futureSubscriptions: `Vous aurez une réduction de ${vars[0]} % pour les prochains réapprovisionnements automatiques de ce produit`,
        firstYearSavings: 'économies pour la première année',
        lastDeliveryLeft: `livraison restante à ${vars[0]} % de réduction`,
        deliveriesLeft: `livraisons restantes à ${vars[0]} % de réduction`,
        discountValidUntil: `Réduction en vigueur jusqu’au ${vars[0]}`,
        discountsValidUntil: `Réductions en vigueur jusqu’au ${vars[0]}`
    };

    return resources[label];
}
