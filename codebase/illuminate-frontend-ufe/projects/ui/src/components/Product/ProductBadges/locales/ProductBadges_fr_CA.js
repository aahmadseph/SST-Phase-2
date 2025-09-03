export default function getResource(label, vars = []) {
    const resources = {
        newText: 'NOUVEAUTÉ',
        rougeBadge: 'ROUGE'
    };
    return resources[label];
}
