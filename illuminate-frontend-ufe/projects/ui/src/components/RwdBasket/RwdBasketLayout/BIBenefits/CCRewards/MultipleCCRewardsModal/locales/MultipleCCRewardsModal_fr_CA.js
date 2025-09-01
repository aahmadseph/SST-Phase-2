export default function getResource(label, vars = []) {
    const resources = {
        title: 'Appliquer les récompenses Carte de crédit',
        available: 'disponible',
        selectThree: 'Sélectionnez jusqu’à trois récompenses',
        creditCardReward: `<b>${vars[0]} $</b> en récompenses carte de crédit`,
        firstTimeDiscount: `<b>${vars[0]}</b> Rabais sur le premier achat`,
        expiry: `Exp. ${vars[0]}`,
        orderSubTotal: 'Sous-total de la commande',
        apply: 'Appliquer',
        applied: 'Appliqué',
        remove: 'Retirer',
        ccMessage: '*Avec votre carte de crédit Sephora ou votre carte Visa Sephora. Des exceptions s’appliquent; ',
        ccMessageWithoutStar: 'Avec votre carte de crédit Sephora ou votre carte Visa Sephora. Des exceptions s’appliquent; ',
        clickHere: 'cliquez ici pour plus de détails',
        done: 'Terminé',
        maxRewardsReached: 'Vous avez atteint le nombre maximal de récompenses Carte de crédit par commande.',
        off: 'de réduction'
    };

    return resources[label];
}
