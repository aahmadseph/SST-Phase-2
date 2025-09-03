export default function getResource(label, vars = []) {
    const resources = {
        in: 'in',
        all: 'All'
    };

    return resources[label];
}
