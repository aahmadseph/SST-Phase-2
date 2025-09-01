export default function getResource(label) {
    const resources = {
        free: 'GRATUIT',
        value: 'valeur',
        onlyAFewLeft: 'Plus que quelques articles en stock',
        color: 'Couleur',
        size: 'Format',
        type: 'Type',
        scent: 'Senteur'
    };
    return resources[label];
}
