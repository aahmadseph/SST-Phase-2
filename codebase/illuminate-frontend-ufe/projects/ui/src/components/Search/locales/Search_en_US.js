export default function getResource(label, vars = []) {
    const resources = {
        searchResults: 'Search Results',
        sale: 'Sale'
    };

    return resources[label];
}
