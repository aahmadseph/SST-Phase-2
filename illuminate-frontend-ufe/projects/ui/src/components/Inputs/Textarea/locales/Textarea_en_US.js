export default function getResource(label, vars = []) {
    const resources = {
        minimum: 'Min.',
        characters: 'characters'
    };

    return resources[label];
}
