export default function getResource(label, vars = []) {
    const resources = {
        privateContent: 'Private content',
        exploreAll: 'Explore all',
        viewAll: 'View all'
    };
    return resources[label];
}
