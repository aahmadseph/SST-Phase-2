export default function getResource(label, vars = []) {
    const resources = {
        item: 'Article',
        price: 'Prix',
        qty: 'Qté',
        amount: 'Montant',
        oosItems: 'Articles en rupture de stock',
        readyForPickup: 'Articles prêts pour le ramassage',
        pickedUpItems: 'Articles ramassés',
        canceledItems: 'Articles non disponibles ou annulés',
        unavailableItems: 'Articles non disponibles',
        deliveredItems: 'Articles livrés',
        notDeliveredItems: 'Articles en cours de livraison'
    };

    return resources[label];
}
