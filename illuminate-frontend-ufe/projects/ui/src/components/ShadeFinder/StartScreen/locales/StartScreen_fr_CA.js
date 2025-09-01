export default function getResource(label, vars = []) {
    const resources = {
        options: 'Vous avez le choix!',
        start: 'Commencez avec le fond de teint que vous utilisez actuellement pour trouver une teinte correspondante dans cette marque.',
        startMultiShadeFinder: 'Commencez avec le fond de teint que vous utilisez actuellement pour trouver des teintes correspondantes dans d’autres marques.',
        getStarted: 'C’est parti'
    };

    return resources[label];
}
