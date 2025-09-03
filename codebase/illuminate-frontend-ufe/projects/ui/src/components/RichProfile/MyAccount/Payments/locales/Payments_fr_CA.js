export default function getResource(label, vars = []) {
    const resources = {
        paymentsAndCredits: 'Paiements et crédits',
        creditCards: 'Cartes de crédit et de débit',
        otherPayments: 'Autres paiements',
        giftCards: 'Cartes-cadeaux',
        accountCredits: 'Crédits au compte',
        expires: 'Expire le'
    };

    return resources[label];
}
