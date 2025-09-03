export default function getResource(label, vars = []) {
    const resources = { similarProductsTitle: 'Similar Products' };
    return resources[label];
}
