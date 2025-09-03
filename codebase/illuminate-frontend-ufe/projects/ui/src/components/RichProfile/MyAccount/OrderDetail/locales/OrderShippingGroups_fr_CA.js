export default function getResource(label, vars = []) {
    const resources = {
        status: 'Statut',
        seeTrackingDetails: 'Voir les détails de suivi',
        shippingMethod: 'Mode d’expédition',
        estimatedDelivery: 'Livraison estimée',
        tracking: 'N° de suivi :',
        deliverTo: 'Livrer à',
        billingInfo: 'Infos de facturation',
        paypalAccount: 'Compte PayPal',
        applePay: 'Apple Pay',
        shipment: 'EXPÉDITION',
        needToReturnSomething: 'Vous devez retourner quelque chose?',
        changedYourMind: 'Vous avez changé d’avis?',
        cancelYourOrder: 'Annulez votre commande',
        paidWith: 'Payé avec ',
        venmoAccount: 'Payé avec Venmo',
        shipTo: 'Expédier à',
        shipToFeDexLocation: 'Expédier à un lieu de ramassage FedEx',
        shipToPickupLocation: 'Expédier à un lieu de ramassage',
        deliveryBy: 'Livraison par',
        autoReplenish: 'Réapprovisionnement automatique',
        manageSubscriptions: 'Gérer les abonnements',
        deliveryIssue: 'Vous rencontrez un problème de livraison?',
        reportIssue: 'Signaler le problème',
        bannerButton: 'Inscrivez-vous aux alertes par texto de Sephora',
        bannerTitle: 'Inscrivez-vous aux alertes par texto de Sephora',
        bannerParagraph: 'Pour tout savoir sur les aubaines exclusives, les nouveautés et plus encore.',
        bannerRates: '*Des frais de messagerie texte et de données peuvent s’appliquer.',
        returnText: 'Vous pouvez commencer un retour dès que les articles pour la livraison sont en route.'
    };

    return resources[label];
}
