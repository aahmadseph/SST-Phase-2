export default function getResource(label, vars = []) {
    const resources = {
        title: 'Rouge-Only Rewards',
        rougeBadge: 'ROUGE',
        viewAll: 'View All'
    };

    return resources[label];
}
