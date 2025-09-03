export default function getResource(label, vars = []) {
    const resources = {
        beautyServices: 'FAQ sur les services beauté',
        happeningAtSephora: 'En cours chez Sephora'
    };

    return resources[label];
}
