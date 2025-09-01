export default function getResource(label, vars = []) {
    const resources = {
        title: 'Récompenses exclusives Rouge',
        rougeBadge: 'ROUGE',
        viewAll: 'Voir tout'
    };

    return resources[label];
}
