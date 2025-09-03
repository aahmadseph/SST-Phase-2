const resources = {
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    emailAddress: 'Adresse de courriel',
    phone: 'Téléphone',
    sendReminders: 'Oui, envoyez-moi des rappels par message texte au sujet de mon rendez-vous.',
    specialRequests: 'Demandes spéciales (facultatives)',
    specialRequestsPlaceholder: 'Aidez nos conseillers beauté à se préparer pour votre visite, par exemple " j’aimerais essayer un nouveau look regard charbonneux pour un événement à venir".',
    completeBooking: 'Compléter la réservation'
};

export default function getResource(label) {
    return resources[label];
}
