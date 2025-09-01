export default function getResource(label, vars = []) {
    const resources = {
        youAreWaitlisted: 'Vous êtes sur la liste d’attente!',
        emailConfirmation: `Vous recevrez un courriel de confirmation de liste d’attente au ${vars[0]}.`,
        artist: `Artiste : ${vars[0]}`,
        specialRequests: `Demandes spéciales : ${vars[0]}`,
        confirmationNumber: 'Numéro de confirmation',
        viewMyReservations: 'Consulter mes réservations',
        cancelWaitlist: 'Annuler la liste d’attente',
        no: 'Non',
        yes: 'Oui'
    };

    return resources[label];
}
