export default function getResource(label, vars = []) {
    const resources = {
        removeAddressLabel: 'Remove address',
        remove: 'Remove',
        editAddressLabel: 'Edit address',
        edit: 'Edit',
        addShippingAddress: 'Add shipping address',
        showMoreAddresses: 'Show more addresses',
        showLessAddresses: 'Show less addresses',
        deliveryMethod: 'Delivery method',
        setAsDefaultCheckbox: 'Set as default shipping address',
        editShipAddress: 'Edit shipping address',
        addNewShipAddress: 'Add new shipping address',
        cancelButton: 'Cancel',
        saveContinueButton: 'Save & Continue',
        continueButton: 'Continue',
        maxShipAddressMessage: `You can have up to ${vars[0]} addresses. Please delete one and try to add again.`,
        areYouSureMessage: 'Are you sure you would like to permanently delete your address?',
        taxExemptAddressLabel: 'Tax-Exempt Address',
        shippingMessage: 'Your gift card will be shipped to this address.'
    };

    return resources[label];
}
