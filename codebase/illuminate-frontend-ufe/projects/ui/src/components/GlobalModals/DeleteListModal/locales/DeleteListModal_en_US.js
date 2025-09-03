export default function getResource(label, vars = []) {
    const resources = {
        deleteList: 'Delete List',
        deleteText: 'Are you sure you want to delete this List? Once deleted, anyone you’ve shared it with will also lose access.',
        yesDeleteList: 'Yes, delete my List',
        noKeepList: 'No, keep my List'
    };

    return resources[label];
}
