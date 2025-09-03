export default function getResource(label, vars = []) {
    const resources = {
        pickupPerson: 'Pickup Person',
        idRequired: 'You will need an *ID that matches* the name above to retrieve your order. Packages will be held for up-to 5 days before being returned to us.',
        idRequiredCA: 'You will need an *ID that matches* the name and address above to retrieve your order. Packages will be held for up-to 15 days before being returned to us.',
        firstName: 'First Name',
        lastName: 'Last Name',
        phoneNumber: 'Phone Number',
        email: 'E-mail Address',
        emailRequiredText: 'Your email address is required for shipping notifications and order tracking.',
        streetAddress: 'Street Address',
        addressLine2: 'Apt #, Floor, etc.',
        postalCode: 'Postal Code',
        invalidPostalCode: 'Please enter a valid zipcode.',
        enterPostalCode: 'Enter Postal Code to see City and Province.',
        city: 'City',
        province: 'Province',
        shipToAddress: 'Ship to address',
        idRequiredEditMode: 'You will need an *ID that matches* the name below to retrieve your order. Packages will be held for up-to 5 days before being returned to us.',
        idRequiredEditModeCA: 'You will need an *ID that matches* the name and address below to retrieve your order. Packages will be held for up-to 15 days before being returned to us.'
    };

    return resources[label];
}
