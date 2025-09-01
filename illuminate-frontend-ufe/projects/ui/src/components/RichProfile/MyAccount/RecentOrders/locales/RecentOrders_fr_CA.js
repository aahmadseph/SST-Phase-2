export default function getResource(label, vars = []) {
    const resources = {
        orders: 'Commandes',
        noOrders: 'Vous n’avez pas de commande récente.',
        orderDate: 'Date de la commande',
        pickupOrder: 'Commande à ramasser',
        sameDayOrder: 'Livraison le jour même',
        standardOrder: 'Commande standard',
        orderNumber: 'Numéro de commande',
        orderType: 'Type de commande',
        status: 'Statut',
        details: 'Détails',
        viewDetails: 'Voir les détails',
        showMore: 'Afficher plus',
        viewAllPurchases: 'Voir tous les achats',
        replenItemsCarouselTitle: 'Réapprovisionner les achats antérieurs',
        replenItemsViewAll: 'Voir tout'
    };

    return resources[label];
}
