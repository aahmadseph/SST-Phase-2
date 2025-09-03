const resources = {
    gisTitle: 'Livrer à',
    sDDAndGISOrders: 'Pour les commandes de livraison le jour même et d’articles à expédier.',
    gISAndAROrders: 'Pour les commandes d’articles à expédier et de réapprovisionnement automatique.',
    sDDAndAROrders: 'Pour les commandes de livraison le jour même et de réapprovisionnement automatique.',
    sDDAndGISAndAROrders: 'Pour les commandes de livraison le jour même, d’articles à expédier et de réapprovisionnement automatique.',
    holdAtLocation: 'Emplacement Fedex',
    holdAtLocationCA: 'Lieu de ramassage Poste Canada',
    deliveryAndPickupInformation: 'Informations sur la livraison et le ramassage'
};

export default function getResource(label) {
    return resources[label];
}
