export default function getResource(label, vars = []) {
    const resources = {
        ends: `Prend fin ${vars[0]}`,
        pointMultiplier: 'Événement multiplicateur de points',
        apply: 'Appliquer le code promotionnel',
        remove: 'Retirer',
        applied: 'Appliqué',
        details: 'Détails',
        perDollar: 'Par dollar',
        pointMultiplierEventTitle: 'Événement multiplicateur de points',
        gotIt: 'Compris'
    };
    return resources[label];
}
