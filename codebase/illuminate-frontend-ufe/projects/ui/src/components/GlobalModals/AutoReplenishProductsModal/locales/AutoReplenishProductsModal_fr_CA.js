export default function getResource(label, vars = []) {
    const resources = {
        deliverEvery: 'Livrer chaque',
        deliveryFrequency: 'Fréquence de livraison',
        itemsInOrder: 'Articles de la commande',
        done: 'Terminé',
        qty: 'Qté'
    };

    return resources[label];
}
