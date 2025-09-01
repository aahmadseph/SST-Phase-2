export default function getResource(label, vars = []) {
    const resources = {
        postalMail: 'Postal Mail',
        status: 'Status:',
        subscribed: 'Subscribed',
        notSubscribed: 'Not subscribed',
        subscribe: 'Subscribe',
        unsubscribe: 'Unsubscribe',
        cancel: 'Cancel',
        save: 'Save',
        outsideMail: 'Sephora does not send postal mail outside the U.S. and Canada.',
        edit: 'Edit'
    };
    return resources[label];
}
