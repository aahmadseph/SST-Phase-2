export default function getResource(label, vars = []) {
    const resources = {
        privateContent: 'Contenu privé',
        exploreAll: 'Explorer tout',
        viewAll: 'Tout afficher'
    };
    return resources[label];
}
