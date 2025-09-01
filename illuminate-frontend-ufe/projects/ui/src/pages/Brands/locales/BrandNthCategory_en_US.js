export default function getResource(label, vars = []) {
    const resources = {
        exploreTheBrand: 'Explore the brand',
        brand: 'Brand'
    };

    return resources[label];
}
