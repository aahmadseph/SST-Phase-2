const resources = {
    searchTitle: 'Rechercher des photos et des vidéos',
    explore: 'Découvrir',
    uploadToGallery: '+ Télécharger dans la galerie',
    cancel: 'Annuler',
    resultsFor: ' résultats pour ',
    clearAll: 'Tout réinitialiser'
};

export default function getResource(label) {
    return resources[label];
}
