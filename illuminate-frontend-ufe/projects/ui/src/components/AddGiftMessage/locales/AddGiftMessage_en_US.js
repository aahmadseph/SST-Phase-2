export default function getResource(label, vars = []) {
    const resources = {
        addGiftMessage: 'Add a Gift Message',
        giftMessageAdded: 'Gift Message Added',
        edit: 'Edit',
        remove: 'Remove'
    };

    return resources[label];
}
