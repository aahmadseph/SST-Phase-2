export default function getResource(label, vars = []) {
    const resources = {
        title: 'Appliquer vos points',
        newTitle: 'Appliquer vos dollars Beauty Insider',
        apply: 'Appliquer',
        applied: 'Appliqué',
        remove: 'Retirer',
        amountApplied: `<b>${vars[0]}</b> de réduction appliqués`,
        newAmountApplied: `<b>${vars[0]}</b> appliqué`,
        pointsAppliedLegal: 'Les points échangés contre des dollars Beauty Insider ne sont pas remboursables.',
        multiplePromoSubTitle: `Jusqu’à <b>${vars[0]}</b> de réduction disponibles`,
        newMultiplePromoSubTitle: `Échangez ${vars[0]} points pour <b>${vars[1]} de réduction</b>`,
        singlePromoSubTitle: `<b>${vars[0]}de réduction</b> (${vars[1]} points)`,
        newSinglePromoSubTitle: `Échangez ${vars[0]} points pour <b>${vars[1]} de réduction</b>`,
        modalTitle: 'Appliquer vos points à votre achat',
        modalSubTitle: `Vous avez actuellement <b>${vars[0]}</b> points`,
        done: 'Terminé',
        biCashAmount: `<b>${vars[0]}</b> Dollars Beauty Insider`,
        pointsAmount: `${vars[0]} points`,
        subtotal: 'Sous-total de la commande',
        chooseText: 'Veuillez choisir une réponse :',
        moreInfo: 'Plus d’information'
    };

    return resources[label];
}
