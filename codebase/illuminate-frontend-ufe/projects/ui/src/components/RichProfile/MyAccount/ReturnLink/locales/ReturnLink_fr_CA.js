export default function getResource(label, vars = []) {
    const resources = {
        startAReturn: 'Commencer un retour',
        startAndTrackAReturn: 'Commencer ou suivre un retour'
    };

    return resources[label];
}
