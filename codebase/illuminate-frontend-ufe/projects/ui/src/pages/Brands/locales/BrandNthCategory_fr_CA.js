export default function getResource(label, vars = []) {
    const resources = {
        exploreTheBrand: 'Découvrir la marque',
        brand: 'Marque'
    };

    return resources[label];
}
