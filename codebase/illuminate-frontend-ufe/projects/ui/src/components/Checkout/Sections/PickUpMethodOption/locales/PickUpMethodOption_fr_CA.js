export default function getResource(label) {
    const resources = {
        gotIt: 'Compris',
        curbsideConcierge: 'Concierge pour ramassage à l’extérieur',
        whatItIs: 'Qu’est-ce que c’est',
        whatToDo: 'Quoi faire',
        curbsideConciergeAltText: 'Icône Concierge pour ramassage à l’extérieur',
        inStorePickupAltText: 'Icône Ramassage en magasin'
    };

    return resources[label];
}
