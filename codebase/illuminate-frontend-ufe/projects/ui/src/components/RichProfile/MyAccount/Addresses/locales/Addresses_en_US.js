export default function getResource(label, vars = []) {
    const resources = {
        savedAddresses: 'Saved Addresses',
        defaultShippingAddress: 'Default shipping address',
        setAsDefaultAddress: 'Set as default address',
        edit: 'Edit',
        delete: 'Delete',
        addShippingAddress: 'Add shipping address',
        title: 'Delete Address',
        message: 'You have exceeded the maximum amount of saved addresses. Please delete one and try to add again.',
        buttonText: 'Continue',
        taxExemptAddressLabel: 'Tax-Exempt Address',
        deleteTaxExemptAddresModalTitle: 'Delete Address?',
        deleteTaxExemptAddresModalMessage: 'If you delete this address, you will also delete your tax exemption status and will need to reapply for another tax-exemption.',
        yes: 'Yes',
        no: 'No'
    };
    return resources[label];
}
