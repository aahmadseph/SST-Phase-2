export default function getResource(label) {
    const resources = {
        itemsInOrder: 'Items in order',
        itemInOrder: 'Item in order'
    };

    return resources[label];
}
