export default function getResource(label, vars = []) {
    const resources = {
        startAReturn: 'Start a return',
        startAndTrackAReturn: 'Start or Track a return'
    };

    return resources[label];
}
