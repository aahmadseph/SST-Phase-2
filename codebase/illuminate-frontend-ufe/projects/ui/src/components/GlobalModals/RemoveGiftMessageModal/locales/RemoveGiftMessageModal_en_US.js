export default function getResource(label, vars = []) {
    const resources = {
        cancel: 'Cancel',
        errorMessage: 'Something went wrong, please try again.',
        gotIt: 'Got It',
        remove: 'Remove',
        title: 'Remove Gift Message',
        warningMessage: 'Are you sure you want to remove your gift message?'
    };

    return resources[label];
}
