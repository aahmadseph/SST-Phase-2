export default function getResource(label, vars = []) {
    const resources = {
        createNewList: 'Créer une nouvelle liste',
        createList: 'Créer une liste',
        enterListName: 'Nommer cette liste…',
        listLimitReachedTitle: 'Limite de la liste atteinte',
        listLimitReachedMessage: 'Vous avez atteint le nombre maximal de listes. Pour en créer une nouvelle, supprimez une liste existante dans ',
        myLists: 'Mes listes',
        gotIt: 'Compris'

    };

    return resources[label];
}
