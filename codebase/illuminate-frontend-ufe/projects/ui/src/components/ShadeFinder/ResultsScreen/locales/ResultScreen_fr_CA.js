export default function getResource(label, vars = []) {
    const resources = {
        found: 'Nous trouvons votre',
        color: 'Couleur :',
        sorry: 'Désolé, nous n’avons pas trouvé de teinte correspondante pour vous.',
        reviewShades: 'Continuer de chercher les teintes disponibles pour',
        selectShade: 'Sélectionner cette teinte',
        done: 'Terminé',
        closest: 'correspondance la plus proche',
        exact: 'correspondance exacte',
        seeAllProducts: 'Voir tous les produits en cette teinte',
        foundMultiShade: 'Nous avons trouvé votre teinte',
        products: 'produits',
        serverErrorMessage: 'Oups! Un problème est survenu.',
        serverErrorAction: 'Cliquez ci-dessus pour trouver votre teinte de nouveau.',
        apiErrorMessage: 'Nous n’avons pas trouvé de résultats…',
        apiErrorAction: 'Veuillez cliquer ci-dessus pour trouver votre teinte de nouveau.',
        queryParamsErrorMessage: 'Bienvenue à l’outil Trouver une teinte',
        queryParamsErrorAction: 'Cliquez ci-dessus pour trouver le fond de teint qui vous convient le mieux.'
    };

    return resources[label];
}
