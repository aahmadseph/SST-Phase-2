export default function getResource(label, vars = []) {
    const resources = {
        loadingLocationHours: 'Chargement des heures d’ouverture de l’emplacement...',
        todaysLocationHours: 'Heures d’ouverture aujourd’hui : '
    };

    return resources[label];
}
