export default function getResource(label, vars = []) {
    const resources = {
        accountNavigation: 'Navigation dans le compte',
        accountInformation: 'Renseignements sur le compte',
        recentOrders: 'Commandes récentes',
        subscriptions: 'Abonnements',
        reservations: 'Réservations',
        savedAddresses: 'Adresses enregistrées',
        paymentsCredits: 'Paiements et crédits',
        emailPreferences: 'Courriel et préférences',
        autoReplenish: 'Réapprovisionnement automatique',
        sameDayUnlimited: 'Livraison le jour même illimitée'
    };

    return resources[label];
}
