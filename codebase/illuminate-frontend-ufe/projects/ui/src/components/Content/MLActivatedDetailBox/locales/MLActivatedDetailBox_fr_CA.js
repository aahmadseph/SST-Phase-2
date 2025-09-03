export default function getResource(label) {
    const resources = {
        startEndDates: 'Date de début et date de fin',
        placement: 'Positionnement',
        modelOutput: 'Sortie du modèle',
        maxSlots: 'Nombre maximal de cases',
        mlActivatedComponent: 'Composante activée par le langage machine',
        closeMlActivatedDetails: 'Fermer les détails activés par le langage machine'
    };

    return resources[label];
}
