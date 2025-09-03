const resources = {
    add: 'Add',
    address2Label: 'Door buzzer, building code, Apt#...etc',
    city: 'City',
    country: 'Country',
    enterZipCode: 'Enter ZIP/Postal Code to see City and State/Region',
    phone: 'Phone Number',
    postalCode: 'Postal Code',
    stateRegion: 'State/Region',
    streetAddress: 'Street Address',
    zipPostalCode: 'ZIP/Postal Code'
};

export default function getResource(label) {
    return resources[label];
}
