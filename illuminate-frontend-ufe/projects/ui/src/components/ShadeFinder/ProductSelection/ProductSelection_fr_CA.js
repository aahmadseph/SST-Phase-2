export default function getResource(label, vars = []) {
    const resources = { selectProduct: ':FR:Select your current product for' };

    return resources[label];
}
