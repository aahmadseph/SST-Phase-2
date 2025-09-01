const resources = {
    placeholderUs: 'Enter ZIP/Postal Code',
    placeholderCa: 'Enter Postal Code',
    placeholderOnline: 'Only available online',
    messageEmpty: 'Invalid zip or postal code.',
    messageInvalid: 'Invalid ZIP/Postal Code.'
};

export default function getResource(label) {
    return resources[label];
}
