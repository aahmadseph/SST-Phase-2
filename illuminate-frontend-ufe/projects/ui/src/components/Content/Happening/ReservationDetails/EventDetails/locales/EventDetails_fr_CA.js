export default function getResource(label) {
    const resources = {
        event: 'Événement',
        free: 'GRATUIT',
        location: 'Emplacement',
        getDirections: 'Obtenir l’itinéraire',
        confirmationNumber: 'Numéro de confirmation'
    };

    return resources[label];
}
