export default function getResource(label, vars = []) {
    const resources = { advertising: 'Publicité' };

    return resources[label];
}
