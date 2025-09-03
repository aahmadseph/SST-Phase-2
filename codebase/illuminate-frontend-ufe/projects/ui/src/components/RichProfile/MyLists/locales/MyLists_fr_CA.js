export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Favoris',
        myLists: 'Mes listes',
        createNewList: 'Créer une nouvelle liste',
        signIn: 'Ouvrir une session',
        signInToView: 'Ouvrez une session pour organiser et partager vos essentiels enregistrés.',
        weThinkYouWillLove: 'Vous pourriez aimer',
        getTheseBeforeGone: 'Procurez-vous-les avant qu’ils ne partent',
        item: 'article',
        items: 'articles',
        of: 'de',
        results: 'Résultats',
        result: 'Résultat',
        emptyLists: 'Vous n’avez rien enregistré dans vos listes. Appuyez sur le cœur à côté des essentiels qui vous intéressent et choisissez une liste à laquelle les ajouter.',
        somethingWentWrong: 'Un problème est survenu. Veuillez essayer de nouveau.',
        gotIt: 'Compris',
        showMoreProducts: 'Afficher plus de produits',
        allSavedItems: 'Tous les articles enregistrés',
        sortText: 'Trier',
        cancel: 'Annuler',
        recentlyAdded: 'Ajouté récemment',
        sale: 'Solde',
        emptySaleFilter: 'Nous sommes désolés, aucun produit ne correspond à vos choix de filtres.'
    };
    return resources[label];
}
