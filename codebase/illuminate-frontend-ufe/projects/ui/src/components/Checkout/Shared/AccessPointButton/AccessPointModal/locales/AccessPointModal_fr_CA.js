export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Expédition à un lieu de ramassage FedEx',
        modalTitleCA: 'Expédition à un lieu de ramassage',
        detailsModalTitle: 'Détails de l’emplacement',
        confirmButton: 'Choisir cet emplacement',
        fedexOnsite: 'FedEx SurPlace',
        getDirections: 'Obtenir l’itinéraire',
        loactionHours: 'Heures d’ouverture de l’emplacement',
        monToFri: 'Du lundi au vendredi',
        monToSat: 'Du lundi au samedi',
        daysRangeSeparator: '-',
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Jeu',
        friday: 'Ven',
        saturday: 'Sam',
        sunday: 'Dim',
        AM: 'Matin',
        PM: 'Soir',
        miles: 'miles',
        kilometers: 'kilomètres',
        away: 'absent',
        openUntil: 'Ouvert jusqu’à',
        noStoresFound: `Nous n’avons pas été en mesure de trouver un magasin près de « ${vars[0]} ». Veuillez essayer un autre emplacement.`,
        enterSearchParams: `Pour afficher les ${vars[0]} près de chez vous, veuillez fournir votre ville et état ou votre code postal, ou cliquez sur le bouton « Utiliser ma position ».`,
        unableToFindResults: `Nous ne pouvons pas trouver les résultats pour les ${vars[0]} pour le moment.`,
        pleaseTryAgain: 'Veuillez essayer de nouveau dans un instant ou passer à une autre méthode de livraison.',
        noLocationHours: 'Pas d’heures d’ouverture',
        fedexLocations: 'Emplacements FedEx',
        canadaPostLocations: 'Emplacements de ramassage de Poste Canada'
    };

    return resources[label];
}
