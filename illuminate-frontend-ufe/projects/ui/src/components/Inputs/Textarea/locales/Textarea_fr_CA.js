export default function getResource(label, vars = []) {
    const resources = {
        minimum: 'Min.',
        characters: 'caractères'
    };

    return resources[label];
}
