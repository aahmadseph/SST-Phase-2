export default function getResource(label, vars = []) {
    const resources = {
        createNewList: 'Create New List',
        createList: 'Create List',
        enterListName: 'Enter a name for this List...',
        listLimitReachedTitle: 'List Limit Reached',
        listLimitReachedMessage: 'You\'ve reached the maximum number of Lists. To create a new one, delete an existing List in ',
        myLists: 'My Lists',
        gotIt: 'Got It'

    };

    return resources[label];
}
