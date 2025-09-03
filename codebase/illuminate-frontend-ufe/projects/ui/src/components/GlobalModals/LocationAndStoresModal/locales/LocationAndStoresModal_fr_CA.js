export default function getResource(label) {
    const resources = {
        locationAndStores: 'Emplacement et magasins',
        cityAndState: 'Ville et état du code postal',
        optional: 'Facultatif : Choisissez des magasins pour restreindre les résultats',
        useCurrentLocation: 'Utiliser l’emplacement actuel',
        cancel: 'Annuler',
        showResults: 'Afficher les résultats'
    };

    return resources[label];
}
