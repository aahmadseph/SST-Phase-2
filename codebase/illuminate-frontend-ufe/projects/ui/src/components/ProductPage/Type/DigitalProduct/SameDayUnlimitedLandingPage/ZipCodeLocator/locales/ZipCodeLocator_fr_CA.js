export default function getResource(label) {
    const resources = {
        SDUAvailable: 'La livraison le jour même illimitée est disponible pour ',
        SDUUnavailable: 'Non disponible pour ',
        yourLocation: 'votre emplacement',
        noSephoraLocations: 'Aucun magasin Sephora n’est disponible près de chez vous pour la livraison le jour même.',
        checkAnotherPostalCode: 'Vérifier un autre code postal',
        checkAnotherZIP: 'Vérifier un autre code postal',
        tapToSeeAvailability: 'Touchez pour voir la disponibilité pour '
    };

    return resources[label];
}
