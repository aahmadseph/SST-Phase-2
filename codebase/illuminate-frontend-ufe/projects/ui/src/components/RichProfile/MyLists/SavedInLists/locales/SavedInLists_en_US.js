export default function getResource(label, vars = []) {
    const resources = {
        savedIn: 'Saved in',
        and: 'and'
    };
    return resources[label];
}
