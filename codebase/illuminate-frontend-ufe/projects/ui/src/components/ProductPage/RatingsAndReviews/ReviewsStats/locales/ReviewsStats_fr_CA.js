export default function getResource(label, vars = []) {
    const resources = {
        recommended: 'Recommandé',
        reviews: 'Commentaires',
        summary: 'Résumé'
    };
    return resources[label];
}
