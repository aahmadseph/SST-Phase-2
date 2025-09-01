export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Store Details',
        backToList: 'Back to stores list'
    };

    return resources[label];
}
