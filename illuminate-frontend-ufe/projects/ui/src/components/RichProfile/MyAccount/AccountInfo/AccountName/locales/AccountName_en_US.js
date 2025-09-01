const resources = {
    nameError: 'Please fill out this field.',
    name: 'Name',
    edit: 'Edit',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    cancel: 'Cancel',
    update: 'Update'
};

export default function getResource(label) {
    return resources[label];
}
