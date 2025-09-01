export default function getResource(label, vars = []) {
    const resources = {
        addedErrorMessage: 'Ce Color IQ a déjà été ajouté',
        defaultErrorMessage: 'Color IQ non valable',
        defaultSkintone: 'Teint par défaut',
        capturedOn: 'Déterminé le',
        tryShadeFinder: 'Essayer l’explorateur de teinte',
        youCanUseOur: 'Vous pouvez utiliser notre ',
        shadeFinder: 'Explorateur de teinte',
        toFindProducts: '  pour trouver des produits correspondants selon votre fond de teint actuel.',
        findYourShade: 'Trouvez votre teinte',
        or: 'Ou',
        getYourSkinScan: 'Faites analyser votre peau',
        pleaseComeToOur: 'Veuillez vous rendre à notre ',
        sephoraStore: 'magasin Sephora',
        toGetYourSkinScan: ' pour faire analyser votre peau et obtenir la couleur parfaite!',
        bookAnAppointment: 'Prendre rendez-vous'
    };

    return resources[label];
}
