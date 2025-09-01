export default function getResource(label, vars = []) {
    const resources = { selectBrand: 'Select your current foundation brand' };

    return resources[label];
}
