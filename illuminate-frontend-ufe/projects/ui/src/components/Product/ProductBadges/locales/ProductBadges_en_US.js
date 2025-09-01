export default function getResource(label, vars = []) {
    const resources = {
        newText: 'NEW',
        rougeBadge: 'ROUGE'
    };
    return resources[label];
}
