const resources = {
    continueShopping: 'Continuer à magasiner',
    checkoutNow: 'Passer à la caisse',
    viewDetails: 'Voir les détails',
    whatYouNeedToKnow: 'Important à savoir',
    creditLimit: 'Limite de crédit : '
};

export default function getResource(label) {
    return resources[label];
}
