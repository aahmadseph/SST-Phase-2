export default function getResource(label, vars = []) {
    const resources = { seeAll: 'Voir tous les' };

    return resources[label];
}
