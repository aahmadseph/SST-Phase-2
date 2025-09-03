export default function getResource(label) {
    const resources = {
        getFreeSameDayDelivery: 'Profitez de la livraison GRATUITE le jour même',
        youGetFreeSameDayDelivery: 'Vous profitez de la livraison GRATUITE le jour même!',
        signUp: 'S’inscrire',
        yourBasketContains: 'Votre panier contient un',
        learnMore: 'En savoir plus',
        startSavingWithSephora: 'Commencez à économiser avec',
        sameDayUnlimited: 'Livraison le jour même illimitée',
        startSavingWithA: 'Commencez à économiser avec un',
        ofSameDayUnlimited: 'de livraison le jour même illimitée.',
        ofSephoraSDU: 'de la livraison le jour même illimitée de Sephora.',
        subscription: 'abonnement.',
        free: 'GRATUIT',
        dayTrial: 'essai de XX jours ',
        tryNowForFree: 'Essayez-la gratuitement'
    };

    return resources[label];
}
