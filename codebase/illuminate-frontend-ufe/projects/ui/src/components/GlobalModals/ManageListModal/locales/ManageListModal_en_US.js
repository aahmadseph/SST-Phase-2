export default function getResource(label, vars = []) {
    const resources = {
        manageList: 'Manage List',
        deleteList: 'Delete List',
        listName: 'List Name',
        save: 'Save',
        cancel: 'Cancel'
    };

    return resources[label];
}
