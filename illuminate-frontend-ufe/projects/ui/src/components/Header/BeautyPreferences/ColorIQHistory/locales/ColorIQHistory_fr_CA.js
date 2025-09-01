export default function getResource(label, vars = []) {
    const resources = {
        colorIQHistoryTitle: 'Vos valeurs Color IQ enregistrées',
        latest: 'ACTUEL',
        captured: 'Capturé',
        gotIt: 'Compris',
        viewAll: 'Voir tout'
    };

    return resources[label];
}
