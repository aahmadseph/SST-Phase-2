
export default function getResource(label, vars = []) {
    const resources = {
        close: 'Close',
        view: 'View'
    };
    return resources[label];
}
