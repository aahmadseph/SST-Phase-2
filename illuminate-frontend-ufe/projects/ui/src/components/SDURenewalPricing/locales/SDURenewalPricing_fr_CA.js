export default function getResource(label, vars = []) {
    const resources = {
        annually: 'chaque année',
        paymentRenews: 'Le paiement sera renouvelé le',
        paymentBegins: 'Le paiement commence le',
        free30DayTrial: 'essai GRATUIT de 30 jours'
    };

    return resources[label];
}
