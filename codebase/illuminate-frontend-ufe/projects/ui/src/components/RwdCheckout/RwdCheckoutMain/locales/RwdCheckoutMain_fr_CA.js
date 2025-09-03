export default function getResource(label, vars = []) {
    const resources = {
        bopisTitle: 'Paiement de la commande « Achetez en ligne, ramassez en magasin »',
        sadTitle: 'Paiement de l’expédition et de la livraison',
        subscriptionUpdate: 'Mise à jour des abonnements',
        checkout: 'Passer à la caisse',
        pickupOrderCheckout: 'Caisse pour la commande à ramasser',
        additionalItemsText: 'Les articles supplémentaires de votre panier ont été enregistrés pour être achetés séparément.',
        yourGiftCardShippedToAddressMessage: 'Votre carte-cadeau sera expédiée à cette adresse.',
        shippedToAddressMessage: 'Le reste de votre commande sera expédié à cette adresse.',
        saveContinueButton: 'Enregistrer et continuer',
        free: 'GRATUIT',
        continueToCheckout: 'Passer à la caisse',
        addTheseModalTitle: 'Ajoutez-les pour moins de 10 $',
        reviewAndPlaceOrder: 'Vérifier et passer la commande',
        cartServiceError: `Nous n’avons pas été en mesure de passer votre commande. Difficulté à se connecter à ${vars[0]}. Veuillez utiliser un autre mode de paiement ou réessayer plus tard.<br><br>S’il y a lieu, nous avons reversé tout frais en cours sur votre compte.`,
        error: 'Erreur',
        ok: 'OK',
        authorizeErrorMessage: `Difficulté à se connecter à ${vars[0]}. Veuillez utiliser un autre mode de paiement ou réessayer plus tard.`
    };

    return resources[label];

}
