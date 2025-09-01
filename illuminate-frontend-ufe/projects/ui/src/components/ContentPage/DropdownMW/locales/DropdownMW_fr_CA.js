export default function getResource(label, vars = []) {
    const resources = {
        in: 'dans',
        all: 'Tous'
    };

    return resources[label];
}
