export default function getResource(label, vars = []) {
    const resources = {
        savedIn: 'Enregistré dans',
        and: 'et'
    };
    return resources[label];
}
