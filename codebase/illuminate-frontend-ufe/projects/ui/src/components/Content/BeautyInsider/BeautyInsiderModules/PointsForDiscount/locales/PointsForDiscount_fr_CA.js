export default function getResource(label, vars = []) {
    const resources = {
        ends: `Prend fin ${vars[0]}`,
        apply: 'Appliquer dans le panier',
        remove: 'Retirer',
        applied: 'Appliqué',
        details: 'Détails',
        off: 'de réduction',
        points: 'points',
        pointsForDiscountEventTitle: 'Points pour l’événement Réductions',
        gotIt: 'Compris',
        eligible: 'Admissible jusqu’à',
        eventDetails: 'Détails de l’événement',
        viewDetails: 'Voir les détails'
    };
    return resources[label];
}
