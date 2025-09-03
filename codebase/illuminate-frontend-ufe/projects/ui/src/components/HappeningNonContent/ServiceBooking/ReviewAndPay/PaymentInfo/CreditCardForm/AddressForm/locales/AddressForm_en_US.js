const resources = {
    usName: 'United States',
    caName: 'Canada',
    firstName: 'First Name',
    lastName: 'Last Name',
    address2Label: 'Apt / Unit / Floor (optional)',
    add: 'Add',
    country: 'Country',
    streetAddress: 'Street Address',
    city: 'City',
    phone: 'Phone',
    postalCode: 'Postal Code',
    zipPostalCode: 'ZIP/Postal Code',
    enterZipCodeText: 'ZIP/ Postal Code',
    region: 'Region',
    stateRegion: 'State/Region',
    province: 'Province'
};

export default function getResource(label) {
    return resources[label];
}
