export default function getResource(label, vars = []) {
    const resources = {
        happening: 'Happening at Sephora',
        find: 'Find a Sephora'
    };

    return resources[label];
}
