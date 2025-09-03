export default function getResource(label, vars = []) {
    const resources = {
        ends: `Prend fin ${vars[0]}`,
        pointMultiplier: 'Événement multiplicateur de points',
        apply: 'Appliquer le code promotionnel',
        remove: 'Retirer',
        applied: 'Appliqué',
        details: 'Voir les détails',
        perDollar: 'Par dollar',
        pointMultiplierEventTitle: 'Événement multiplicateur de points',
        gotIt: 'Compris'
    };
    return resources[label];
}
