export default function getResource(label, vars = []) {
    const resources = {
        sameDayUnlimited: 'Livraison le jour même illimitée',
        memberSince: 'Membre depuis',
        annually: 'Chaque année',
        cancelSubscription: 'Annuler l’abonnement',
        sduSavingsUS: '6,95 $',
        sduSavingsCA: '9,95 $',
        paymentMethod: 'Mode de paiement',
        edit: 'Modifier',
        renews: 'Renouvelle',
        paymentBegins: 'Le paiement commence',
        membershipPerks: 'Avantages de l’abonnement',
        subscriptionCanceled: 'Votre abonnement a été annulé',
        canceled: 'Annulée',
        expiresOn: 'Expire le'
    };

    return resources[label];
}
