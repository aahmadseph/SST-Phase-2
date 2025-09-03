export default function getResource(label) {
    const resources = {
        items: 'Items',
        item: 'Item',
        substitution: 'Substitution Preferences',
        itemsInOrder: 'Items in order',
        substituteWith: 'Substitude with:',
        doNotsubstitute: 'Do not substitute',
        size: 'Size'
    };

    return resources[label];
}
