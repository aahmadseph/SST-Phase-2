export default function getResource(label, vars = []) {
    const resources = {
        pickAStore: 'Choisir un magasin',
        showMap: 'Afficher la carte',
        hideMap: 'Masquer la carte',
        showMoreLocations: 'Afficher plus d’emplacements',
        continueToPickArtist: 'Continuer pour choisir un(e) artiste, une date et une heure',
        noResultsFound: 'Aucun résultat trouvé',
        noResultsMessage: 'Nous n’avons pas trouvé de magasin correspondant à votre recherche. Veuillez préciser vos critères de recherche et réessayer.',
        ok: 'OK',
        noStoresErrorMessage: 'Nous sommes désolés, nous n’avons pas trouvé de magasins dans un rayon de 80 kilomètres qui offrent ce service. Veuillez ajuster vos critères de recherche et réessayer.'
    };

    return resources[label];
}
