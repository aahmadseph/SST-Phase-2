export default function getResource(label, vars = []) {
    const resources = {
        new: 'NOUVEAUTÉ',
        allBrands: 'Toutes les marques',
        brandsAZ: 'Marques de A à Z'
    };

    return resources[label];
}
