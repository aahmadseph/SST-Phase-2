export default function getResource(label, vars = []) {
    const resources = {
        all: 'All',
        featured: 'Featured'
    };

    return resources[label];
}
