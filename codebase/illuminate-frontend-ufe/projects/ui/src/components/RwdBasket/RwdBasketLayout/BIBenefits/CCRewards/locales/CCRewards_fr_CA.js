export default function getResource(label, vars = []) {
    const resources = {
        applyCCRewards: 'Appliquer les récompenses Carte de crédit',
        apply: 'Appliquer',
        available: 'disponible',
        firstPurchaseAvailable: 'Premier achat disponible',
        firstPurchaseApplied: 'Premier achat appliqué',
        applied: 'Appliqué',
        remove: 'Retirer',
        ccMessage: '*Avec votre carte de crédit Sephora ou votre carte Visa Sephora. Des exceptions s’appliquent; ',
        ccMessageWithoutStar: 'Avec votre carte de crédit Sephora ou votre carte Visa Sephora. Des exceptions s’appliquent; ',
        clickHere: 'cliquez ici pour plus de détails',
        off: 'de réduction',
        expiry: `Exp. ${vars[0]}`
    };

    return resources[label];
}
