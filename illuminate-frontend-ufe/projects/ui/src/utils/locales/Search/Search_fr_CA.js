export default function getResource(label, vars = []) {
    const resources = {
        categories: 'Catégories',
        category: 'Catégorie'
    };
    return resources[label];
}
