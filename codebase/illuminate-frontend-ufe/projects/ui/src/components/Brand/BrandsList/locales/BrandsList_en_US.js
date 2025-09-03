export default function getResource(label, vars = []) {
    const resources = {
        new: 'NEW',
        allBrands: 'All Brands',
        brandsAZ: 'Brands A-Z'
    };

    return resources[label];
}
