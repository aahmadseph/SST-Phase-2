export default function getResource(label, vars = []) {
    const resources = {
        UPCOMING: 'À venir',
        PAST: 'Passé',
        CANCELLED: 'Annulée',
        CANCELLED_BY_STORE: 'Annulé par le magasin',
        LATE_CANCELLATION: 'Annulation tardive',
        NO_SHOW: 'Absence',
        fee: `${vars[0]} Frais`,
        WAITLIST: 'Liste d’attente',
        WAITLIST_HOLD: `Place sur la liste d’attente réservée jusqu’au ${vars[0]}`,
        WAITLIST_EXPIRED: 'Liste d’attente expirée',
        WAITLIST_CANCELED: 'Liste d’attente annulée'
    };

    return resources[label];
}
