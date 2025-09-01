export default function getResource(label) {
    const resources = {
        itemsInOrder: 'Articles de la commande',
        itemInOrder: 'Article de la commande'
    };

    return resources[label];
}
