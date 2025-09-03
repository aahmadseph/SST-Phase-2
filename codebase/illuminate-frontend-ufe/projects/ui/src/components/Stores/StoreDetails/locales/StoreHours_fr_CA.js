export default function getResource(label, vars = []) {
    const resources = {
        hours: 'Heures',
        openTodayUntil: 'Ouvert aujourd’hui jusqu’à'
    };

    return resources[label];
}
