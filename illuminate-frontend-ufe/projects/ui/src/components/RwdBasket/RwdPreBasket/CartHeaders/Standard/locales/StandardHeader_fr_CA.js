export default function getResource(label, vars = []) {
    const resources = {
        standard: 'Faites livrer'
    };
    return resources[label];
}
