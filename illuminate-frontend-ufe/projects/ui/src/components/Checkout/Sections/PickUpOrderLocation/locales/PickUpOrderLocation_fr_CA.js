export default function getResource(label) {
    const resources = {
        storeDetails: 'Détails du magasin',
        choosePickupMethod: 'Veuillez choisir une autre méthode de ramassage : ',
        inStorePickup: 'Ramassage en magasin',
        curbsideConcierge: 'Concierge pour ramassage à l’extérieur',
        errorTitle: 'Veuillez réessayer plus tard',
        ok: 'O.K.'
    };

    return resources[label];
}
