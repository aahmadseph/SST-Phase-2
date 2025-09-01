export default function getResource (label, vars = []) {
    const resources = {
        month: 'Mois',
        day: 'Jour',
        year: 'Année'
    };
    return resources[label];
}
