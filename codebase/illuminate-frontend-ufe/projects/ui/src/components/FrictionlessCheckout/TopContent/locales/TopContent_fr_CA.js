const resources = {
    freeReturns: 'Retours gratuits sur tous les achats*',
    verifyCVVeFulfilledOrder: 'Cette commande ne requiert aucun paiement ou adresse de livraison. Le CVV/CVC est requis à des fins de sécurité seulement. Veuillez vérifier vos renseignements avant de passer votre commande.',
    verifyCVV: 'Aucun paiement n’est requis. Veuillez vérifier votre numéro CVV/CVC à des fins de sécurité. Veuillez vérifier vos renseignements avant de passer votre commande.',
    noPaymentRequired: 'Aucun paiement n’est requis. Veuillez vérifier vos renseignements avant de passer votre commande.'
};

export default function getResource(label) {
    return resources[label];
}
