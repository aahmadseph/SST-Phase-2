const resources = {
    title: 'Same-Day Delivery Instructions',
    optional: '(Optional)',
    cancel: 'Cancel',
    saveInstructions: 'Save Instructions',
    edit: 'Edit',
    textInputLabel: 'Example: Please enter gate code when you arrive.',
    deliveryNote: 'We will leave your items at your door if you\'re not around for the delivery.'
};

export default function getResource(label) {
    return resources[label];
}
