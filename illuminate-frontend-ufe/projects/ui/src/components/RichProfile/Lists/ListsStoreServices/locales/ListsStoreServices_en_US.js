export default function getResource(label, vars = []) {
    const resources = {
        inStoreServices: 'In-store Services',
        makeoverAt: '- Makeover at',
        findStore: 'Find in store'
    };
    return resources[label];
}
