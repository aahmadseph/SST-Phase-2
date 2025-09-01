export default function getResource(label, vars=[]) {
    const resources = {
        outOfStock: 'Rupture de stock'
    };

    return resources[label];
}
