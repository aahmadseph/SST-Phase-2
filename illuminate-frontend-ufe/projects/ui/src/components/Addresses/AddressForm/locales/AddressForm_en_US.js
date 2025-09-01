const resources = {
    usName: 'United States',
    caName: 'Canada',
    firstName: 'First Name',
    lastName: 'Last Name',
    address2Label: 'Door buzzer, building code, Apt#...etc',
    add: 'Add',
    country: 'Country',
    streetAddress: 'Street Address',
    city: 'City',
    phone: 'Phone',
    postalCode: 'Postal Code',
    zipPostalCode: 'ZIP/Postal Code',
    emailAddress: 'Email Address',
    enterZipCodeText: 'Enter ZIP/Postal Code to see City and State/Region.',
    region: 'Region',
    stateRegion: 'State/Region',
    province: 'Province',
    emailRequiredText: 'Your email address is required for shipping notifications and order tracking.',
    optional: '(optional)',
    phoneContext: '(for delivery questions)'
};

export default function getResource(label) {
    return resources[label];
}
