export default function getResource(label, vars = []) {
    const resources = {
        storeHoursTitle: 'Heures d’ouverture',
        openUntil: `Ouvert jusqu’à ${vars[0]} aujourd’hui`,
        availableUntil: `Disponible jusqu’à ${vars[0]} aujourd’hui`,
        tempClosed: 'Temporairement fermé',
        tempUnavailable: 'Non disponible pour le moment',
        specialStoreHoursTitle: 'Heures d’ouverture spéciales',
        curbsideHoursTitle: 'Heures du ramassage à l’extérieur',
        specialCurbsideHours: 'Heures spéciales du ramassage à l’extérieur',
        unavailableToday: 'Non disponible aujourd’hui'
    };

    return resources[label];
}
