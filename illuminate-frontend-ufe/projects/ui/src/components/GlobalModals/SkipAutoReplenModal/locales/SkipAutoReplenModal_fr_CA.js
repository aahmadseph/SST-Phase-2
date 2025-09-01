export default function getResource(label, vars = []) {
    const resources = {
        title: 'Sauter l’article',
        mainHeader: 'Êtes-vous sûr de vouloir sauter votre prochaine commande? Votre abonnement reprendra automatiquement la livraison le',
        skip: 'Passer',
        cancel: 'Annuler',
        item: 'ARTICLE',
        qty: 'Qté',
        notRated: 'Aucune note',
        oneReview: 'Un commentaire',
        yearlySavings: 'économies annuelles',
        nextShipmentBy: 'Prochaine livraison le',
        skipRememberMessage: 'N’oubliez pas que vous avez seulement jusqu’au',
        skipRememberMessageLastRemaining: `pour réclamer votre dernier ${vars[0]} % de réduction restant.`,
        skipRememberMessageNonLastRemaining: `pour réclamer vos ${vars[0]} ${vars[1]} % de réduction restants.`,
        firstYearSavings: 'économies pour la première année',
        lastDeliveryLeft: `livraison restante à ${vars[0]} % de réduction`,
        deliveriesLeft: `livraisons restantes à ${vars[0]} % de réduction`,
        discountValidUntil: `Réduction en vigueur jusqu’au ${vars[0]}`,
        discountsValidUntil: `Réductions en vigueur jusqu’au ${vars[0]}`,
        rateOf: 'à un taux de',
        percentageOff: `${vars[0]} % de réduction`,
        disruptsScheduleMessage: `Obtenez votre article avant le ${vars[0]} pour réclamer`,
        disruptsScheduleMessageNonLast: `vos ${vars[0]} ${vars[1]} % de réduction restants avant leur expiration`,
        disruptsScheduleMessageLast: `votre dernier ${vars[0]} % de réduction restant avant son expiration`
    };

    return resources[label];
}
