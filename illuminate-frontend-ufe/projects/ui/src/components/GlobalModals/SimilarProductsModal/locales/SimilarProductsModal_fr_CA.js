export default function getResource(label, vars = []) {
    const resources = { similarProductsTitle: 'Produits similaires' };
    return resources[label];
}
