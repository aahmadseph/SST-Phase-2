export default function getResource(label, vars = []) {
    const resources = {
        add: 'Add',
        remove: 'Remove',
        addedText: 'Added'
    };

    return resources[label];
}
