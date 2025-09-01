export default function getResource(label, vars = []) {
    const resources = {
        openUntil: `Ouvert jusqu’à ${vars[0]}`,
        closed: 'Fermé',
        storeHoursUnavailable: 'Heures d’ouverture non disponibles'
    };
    return resources[label];
}
