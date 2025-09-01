export default function getResource(label, vars = []) {
    const resources = {
        title: 'My Lists',
        createNewList: 'Create New List',
        done: 'Done',
        add: 'Add',
        item: 'Item',
        items: 'Items',
        somethingWentWrong: 'Something went wrong. Please try again.',
        maxProductsSavedErrorMessage: 'Max number of products saved in List. To add more, please remove products first.',
        added: 'Added',
        remove: 'Remove'
    };

    return resources[label];
}
