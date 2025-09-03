export default function getResource(label, vars=[]) {
    const resources = {
        service: 'Service',
        details: 'Détails',
        artist: 'Artiste : ',
        selectedFeature: `Caractéristique sélectionnée : ${vars[0]}`,
        specialRequests: `Demande spéciale : ${vars[0]}`,
        notProvided: 'Demande spéciale : Non fourni',
        location: 'Emplacement',
        confirmationNumber: 'Numéro de confirmation',
        payment: 'Paiement',
        estimatedCost: 'Coût estimé',
        taxesHit: 'taxes fédérales et provinciales non affichées',
        paymentHold: 'Mode de paiement en attente',
        noArtist: 'Tous les artistes disponibles',
        getDirections: 'Obtenir l’itinéraire',
        defaultNoShow: '0 $'
    };

    return resources[label];
}
