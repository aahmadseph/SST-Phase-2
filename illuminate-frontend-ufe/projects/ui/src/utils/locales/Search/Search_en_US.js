export default function getResource(label, vars = []) {
    const resources = {
        categories: 'Categories',
        category: 'Category'
    };
    return resources[label];
}
