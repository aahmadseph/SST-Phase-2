export default function getResource(label, vars = []) {
    const resources = {
        edit: 'Edit',
        artist: `Artist: ${vars[0]}`
    };

    return resources[label];
}
