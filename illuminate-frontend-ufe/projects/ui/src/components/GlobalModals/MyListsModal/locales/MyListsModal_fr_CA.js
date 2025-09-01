export default function getResource(label, vars = []) {
    const resources = {
        title: 'Mes listes',
        createNewList: 'Créer une nouvelle liste',
        done: 'Terminé',
        add: 'Ajouter',
        item: 'Article',
        items: 'Articles',
        somethingWentWrong: 'Un problème est survenu. Veuillez essayer de nouveau.',
        maxProductsSavedErrorMessage: 'Nombre maximal d’articles enregistrés dans la liste. Pour en ajouter d’autres, veuillez d’abord supprimer des produits.',
        added: 'Ajouté',
        remove: 'Retirer'
    };

    return resources[label];
}
