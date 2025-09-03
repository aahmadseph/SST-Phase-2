export default function getResource(label, vars = []) {
    const resources = {
        rsvpTitle: 'S’inscrire à cet événement',
        showMoreLocations: 'Afficher plus d’emplacements et de dates',
        showLess: 'Afficher moins',
        addToCalendar: 'Ajouter au calendrier',
        rsvp: 'Réserver',
        manageRsvp: 'Gérer les réservations'
    };

    return resources[label];
}
