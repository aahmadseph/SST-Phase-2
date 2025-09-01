export default function getResource(label, vars = []) {
    const resources = {
        manageList: 'Modifier la liste',
        deleteList: 'Supprimer la liste',
        listName: 'Nom de la liste',
        save: 'Enregistrer',
        cancel: 'Annuler'
    };

    return resources[label];
}
