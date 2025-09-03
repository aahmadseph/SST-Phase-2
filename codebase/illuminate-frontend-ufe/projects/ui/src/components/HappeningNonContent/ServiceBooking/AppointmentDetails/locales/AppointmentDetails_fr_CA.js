export default function getResource(label, vars = []) {
    const resources = {
        edit: 'Modifier',
        artist: `Artiste : ${vars[0]}`
    };

    return resources[label];
}
