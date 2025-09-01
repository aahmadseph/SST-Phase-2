export default function getResource(label, vars = []) {
    const resources = {
        loadingLocationHours: 'Loading location hours...',
        todaysLocationHours: 'Today’s hours: '
    };

    return resources[label];
}
