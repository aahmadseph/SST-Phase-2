export default function getResource(label, vars = []) {
    const resources = { selectProduct: 'Select your current product for' };

    return resources[label];
}
