const resources = {
    sendSpecialOffers: 'We’ll send you special offers, store news, and updates on the latest beauty trends.',
    sampleEmail: 'See sample email',
    status: 'Status:',
    subscribed: 'Subscribed',
    notSubscribed: 'Not subscribed',
    frequency: 'Frequency:',
    country: 'Country:',
    postalCode: 'Postal Code:',
    promotional: 'Promotional',
    emails: 'Emails',
    subscribe: 'Subscribe',
    unsubscribe: 'Unsubscribe',
    allOffers: 'All Offers',
    weekly: 'Weekly',
    monthly: 'Monthly',
    enterZip: 'Enter your ZIP postal code to hear about store events near you.',
    zipCode: 'ZIP code',
    pleaseEnterZip: 'Please enter ZIP/Postal code.',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit'
};

export default function getResource(label) {
    return resources[label];
}
