export default function getResource(label, vars = []) {
    const resources = {
        title: 'Livraison le jour même illimitée de Sephora',
        subscribeToSephora: 'S’abonner à la',
        subHeader: 'Livraison le jour même illimitée',
        free30DayTrial: 'essai GRATUIT de 30 jours',
        then: 'ensuite',
        annually: 'chaque année',
        regionalAvailability: 'Disponibilité régionale',
        addTrialToBasket: 'Ajouter l’essai gratuit au panier',
        addSubscriptionToBasket: 'Ajouter l’abonnement au panier',
        sameDayUnlimited: 'Livraison le jour même illimitée',
        add: 'Ajouter',
        toBasket: 'au panier',
        trial: 'Essai',
        subscription: 'Abonnement',
        alreadyAddedToBasket: 'Déjà ajouté au panier',
        viewBasket: 'Voir le panier et passer à la caisse',
        joinForOnly: 'Inscrivez-vous pour seulement',
        hasBeenAdded: 'a été ajouté à votre panier!',
        activateSubscription: 'Activez votre abonnement et économisez sur votre commande en cours en passant à la caisse de sortie.',
        activateYour: 'Activez votre',
        free30day: 'essai GRATUIT de 30 jours',
        andSave: 'et économisez sur votre commande en cours en passant à la caisse de sortie.'
    };

    return resources[label];
}
