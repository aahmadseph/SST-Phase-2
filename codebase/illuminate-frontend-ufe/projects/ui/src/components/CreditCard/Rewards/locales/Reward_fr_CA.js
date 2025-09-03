export default function getResource(label) {
    const resources = {
        ccReward: 'Récompense carte de crédit',
        firstPurchase: 'Premier achat',
        remove: 'Retirer',
        apply: 'Appliquer',
        applied: 'Appliqué',
        exp: 'Exp.'
    };

    return resources[label];
}
