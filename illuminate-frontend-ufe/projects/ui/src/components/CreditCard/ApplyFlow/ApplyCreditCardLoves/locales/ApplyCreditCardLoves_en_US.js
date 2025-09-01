
export default function getResource(label, vars = []) {
    const resources = {
        shopFaves: 'Shop Your Favorites',
        fromLovesList: 'From your Loves list.',
        viewAll: 'View all'
    };
    return resources[label];
}
