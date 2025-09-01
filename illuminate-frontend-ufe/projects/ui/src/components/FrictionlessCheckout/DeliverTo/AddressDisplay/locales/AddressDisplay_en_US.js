const resources = {
    edit: 'Edit',
    changeShippingAddress: 'Change shipping address'
};

export default function getResource(label) {
    return resources[label];
}
