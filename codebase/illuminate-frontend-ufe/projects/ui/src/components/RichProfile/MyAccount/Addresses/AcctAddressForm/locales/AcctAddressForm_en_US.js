export default function getResource(label, vars = []) {
    const resources = {
        address: 'Address',
        setAsDefaultAddress: 'Set as default address',
        removeAddress: 'Remove address',
        cancel: 'Cancel',
        update: 'Update',
        save: 'Save',
        edit: 'Edit',
        add: 'Add',
        title: 'Delete address',
        message: 'Are you sure you would like to permanently delete your address?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    };
    return resources[label];
}
