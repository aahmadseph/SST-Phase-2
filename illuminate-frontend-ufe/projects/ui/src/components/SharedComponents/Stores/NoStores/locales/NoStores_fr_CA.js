export default function getResource(label, vars = []) {
    const resources = {
        noStoreNear: `Nous n’avons pas été en mesure de trouver un magasin près de « ${vars[0]} ».`,
        pleaseTryDifferentLocation: 'Veuillez essayer un autre emplacement.',
        localeError: `Pour sélectionner un magasin au ${vars[0]}, allez `,
        bottomOfSite: 'au bas de la page ',
        localeError2: `et changez votre région pour ${vars[0]}.`,
        localeErrorLine2: `Une fois le pays modifié, tous les articles dont la vente est restreinte au ${vars[0]} ou les articles Réservation et ramassage seront retirés de votre panier.`
    };

    return resources[label];
}
