export default function getResource(label, vars = []) {
    const resources = {
        autoReplenish: 'Réapprovisionnement automatique',
        freeShipping: 'Livraison gratuite avec réapprovisionnement automatique',
        getItFor: 'obtenez-le pour',
        withAutoReplen: 'avec le réapprovisionnement automatique',
        deliveryFrequency: 'Fréquence de livraison',
        save: 'économisez',
        annuallySubscription: 'au cours de la première année de votre abonnement.',
        subscriptionFreeShipping: 'Économies d’abonnement avec livraison gratuite',
        freeStandardShipping: 'Livraison standard gratuite avec le réapprovisionnement automatique'
    };
    return resources[label];
}
