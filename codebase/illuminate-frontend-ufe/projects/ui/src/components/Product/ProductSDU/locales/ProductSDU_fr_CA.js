export default function getResource(label) {
    const resources = {
        annually: 'chaque année',
        paymentBeginsOn: 'Le paiement commence le',
        paymentRenewsOn: 'Le paiement sera renouvelé le',
        sephoraSubscription: 'Abonnement Sephora',
        sameDayUnlimited: 'Livraison le jour même illimitée',
        free30DayTrial: 'essai GRATUIT de 30 jours',
        qty: 'Qté',
        free: 'GRATUIT'
    };
    return resources[label];
}
