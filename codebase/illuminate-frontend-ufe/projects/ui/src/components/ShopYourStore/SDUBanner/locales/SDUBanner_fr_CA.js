export default function getResource(label) {
    const resources = {
        getFreeSameDayDelivery: 'Profitez de la livraison GRATUITE le jour même',
        tryNowForFree: 'Essayez-la gratuitement',
        startSaving: 'Commencez à économiser avec un *essai GRATUIT de 30 jours* pour la livraison le jour même illimitée de Sephora.'
    };

    return resources[label];
}
