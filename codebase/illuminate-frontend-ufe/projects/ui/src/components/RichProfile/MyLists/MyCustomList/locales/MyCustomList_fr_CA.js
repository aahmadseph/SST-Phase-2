export default function getResource(label, vars = []) {
    const resources = {
        myLists: 'Mes listes',
        signIn: 'Ouvrir une session',
        signInToView: 'Ouvrez une session pour organiser et partager vos essentiels enregistrés.',
        weThinkYouWillLove: 'Vous pourriez aimer',
        getTheseBeforeGone: 'Procurez-vous-les avant qu’ils ne partent',
        item: 'article',
        items: 'articles',
        edit: 'Modifier',
        yourListIsEmpty: 'Votre liste est vide. Faites le suivi des essentiels beauté qui vous intéressent en appuyant sur le cœur à côté de chaque produit et en sélectionnant cette liste.',
        sharedListIsEmpty: 'Le ou la propriétaire de la liste n’y a pas encore ajouté d’essentiels. Veuillez revenir plus tard.',
        browseProducts: 'Parcourir les produits',
        share: 'Partager',
        of: 'de',
        results: 'Résultats',
        result: 'Résultat',
        showMoreProducts: 'Afficher plus de produits',
        rouge: 'ROUGE',
        sharedList: 'Liste partagée',
        sortText: 'Trier',
        cancel: 'Annuler'
    };
    return resources[label];
}
