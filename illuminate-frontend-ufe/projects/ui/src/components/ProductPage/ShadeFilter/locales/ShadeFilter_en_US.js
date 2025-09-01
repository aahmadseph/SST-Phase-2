export default function getResource(label, vars = []) {
    const resources = {
        done: 'Done',
        all: 'All',
        clear: 'Clear',
        shade: 'Shade'
    };
    return resources[label];
}
