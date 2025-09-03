export default function getResource(label) {
    const resources = {
        secure: 'Sûr',
        edit: 'Modifier',
        shippingTo: 'Expédier à',
        pickUpOrderContactInfo: 'Personne qui ramassera la commande',
        pickUpOrderLocationInfo: 'Lieu du ramassage',
        giftCardShippingAddress: 'Adresse de livraison pour la carte-cadeau',
        giftCardDeliveryMessage: 'Livraison de la carte-cadeau',
        shippingAddress: 'Adresse de livraison',
        deliveryGiftOptions: 'Livraison',
        deliveryAutoReplenish: 'Livraison',
        paymentMethod: 'Mode de paiement',
        accountCreation: 'Création du compte',
        reviewPlaceOrder: 'Vérifier et passer la commande',
        shippingDelivery: 'Expédition et livraison',
        shippingToFedex: 'Expédier à un lieu de ramassage FedEx',
        shipToPickupLocation: 'Expédition à un lieu de ramassage',
        reviewSubmitEditsTitle: 'Vérifier et soumettre les modifications',
        reviewSubmitSubscribeTitle: 'Vérifier et s’inscrire',
        updatedBadge: 'MIS À JOUR',
        deliverTo: 'Livrer à',
        deliverToNote: 'Adresse utilisée pour les commandes de livraison le jour même et standard',
        deliverToNoteAutoReplenish: 'Adresse utilisée pour les commandes de réapprovisionnement automatique, de livraison le jour même et standard',
        somePaymentCannotUsed: 'Certains modes de paiement ne peuvent pas être utilisés pour l’achat d’un abonnement.',
        giftMessage: 'Message du cadeau',
        freeReturns: 'Retours gratuits',
        onAllPurchases: 'sur tous les achats.*'
    };

    return resources[label];
}
