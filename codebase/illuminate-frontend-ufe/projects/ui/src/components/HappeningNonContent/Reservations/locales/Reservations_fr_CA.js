export default function getResource(label, vars = []) {
    const resources = {
        upcoming: 'À venir',
        past: 'Passé',
        notAttended: 'Manquées',
        canceled: 'Annulée',
        title: 'Mes réservations',
        bookService: 'Réserver un service',
        browseEvent: 'Parcourir les événements',
        cancelEvent: 'Annuler la réponse',
        less24HoursCancel: 'Souhaitez-vous vraiment annuler? Une annulation dans les 24 heures précédant votre rendez-vous entraînera des frais de XX $. Consultez les politiques pour plus de détails',
        normalCancel: 'Souhaitez-vous vraiment annuler?',
        modalContent: 'Souhaitez-vous vraiment annuler la confirmation de votre présence?',
        modalNoButton: 'Non',
        modalYesButton: 'Oui',
        showMoreButton: 'Afficher plus de réservations'
    };

    return resources[label];
}
