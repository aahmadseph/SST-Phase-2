export default function getResource(label, vars = []) {
    const resources = {
        useLocation: 'Utiliser ma position',
        chooseLocation: 'Choisir un lieu',
        updatingLocationText: 'La mise à jour de l’emplacement actualisera automatiquement les magasins et les plages horaires affichés.',
        cityStateZip: 'Ville et état ou code postal',
        clear: 'Réinitialiser',
        noStoreFound: `Nous n’avons pas été en mesure de trouver un magasin près de « ${vars[0]} ». Veuillez essayer un autre emplacement.`,
        locationSharingDisabled: 'Le partage de position est désactivé',
        locationUpdateSettings: 'Pour partager votre position, veuillez mettre à jour les paramètres de votre navigateur.',
        ok: 'OK'
    };

    return resources[label];
}
