export default function getResource(label, vars = []) {
    const resources = {
        done: 'Done',
        clear: 'Clear'
    };
    return resources[label];
}
