export default function getResource(label) {
    const resources = {
        subscriptionUpdate: 'Mise à jour des abonnements',
        checkout: 'Passer à la caisse',
        pickupOrderCheckout: 'Caisse pour la commande à ramasser',
        additionalItemsText: 'Les articles supplémentaires de votre panier ont été enregistrés pour être achetés séparément.',
        yourGiftCardShippedToAddressMessage: 'Votre carte-cadeau sera expédiée à cette adresse.',
        shippedToAddressMessage: 'Le reste de votre commande sera expédié à cette adresse.',
        saveContinueButton: 'Enregistrer et continuer',
        free: 'GRATUIT',
        continueToCheckout: 'Passer à la caisse',
        addTheseModalTitle: 'Ajoutez-les pour moins de 10 $'
    };

    return resources[label];
}
