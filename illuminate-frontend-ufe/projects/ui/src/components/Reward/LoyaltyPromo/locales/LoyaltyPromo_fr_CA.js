export default function getResource(label, vars = []) {
    const resources = {
        chooseOne: 'Veuillez choisir une réponse :',
        singleCbrPointsNonRefundable: 'Les points échangés contre des dollars Beauty Insider ne sont pas remboursables.',
        pointsNonrefundable: 'Les points appliqués pour les dollars Beauty Insider ou les points pour réductions ne sont pas remboursables.',
        applyPoints: 'Appliquer vos points',
        applyPointsLong: 'Appliquer vos points à votre achat',
        upto: 'Jusqu’à',
        youNowHaveText: `Vous avez maintenant *${vars[0]}* points`,
        youAreExceeding: `Vous dépassez de *${vars[0]}* points`,
        gotIt: 'Compris',
        available: 'disponible',
        applied: 'Appliqué',
        orderSubtotal: 'Sous-total de la commande',
        off: 'de réduction',
        BeautyInsiderCashTitle: 'Dollars Beauty Insider',
        PointsForDiscountTitle: 'Points pour l’événement Réductions',
        cbrPointsApplied: `*${vars[0]}* appliqué`,
        pfdPointsApplied: `*${vars[0]} % de réduction* appliqué`,
        singleCbrNoPfdPoints: `*${vars[0]} de réduction* (${vars[1]} points)`,
        singleCbrWithPfdPoints: `*${vars[0]} de réduction* ou jusqu’à *${vars[1]} % de réduction*`,
        manyCbrWithPfdPoints: `Jusqu’à *${vars[0]} de réduction* ou *${vars[1]} % de réduction*`,
        pfdPointsOnly: `Jusqu’à *${vars[0]} % de réduction*`,
        cbrPointsOnly: `Jusqu’à *${vars[0]}* disponibles`,
        ends: `Prend fin ${vars[0]}`,
        remove: 'Retirer',
        apply: 'Appliquer',
        points: 'points',
        cbrTitle: 'Dollars Beauty Insider',
        useBiPoints: 'Utiliser vos points Beauty Insider'
    };

    return resources[label];
}
