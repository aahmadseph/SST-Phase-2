export default function getResource(label, vars = []) {
    const resources = {
        hours: 'Hours',
        openTodayUntil: 'Open today until'
    };

    return resources[label];
}
