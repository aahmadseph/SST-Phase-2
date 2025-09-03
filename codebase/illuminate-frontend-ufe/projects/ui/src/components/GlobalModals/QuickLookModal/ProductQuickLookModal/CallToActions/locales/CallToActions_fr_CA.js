export default function getResource(label, vars = []) {
    const resources = {
        viewFullSizeLabel: 'Voir en format standard',
        viewDetailsLabel: 'Voir les détails',
        seeFullDetails: 'Voir tous les détails'
    };
    return resources[label];
}
