export default function getResource(label, vars = []) {
    const resources = {
        creditOrDebitCard: 'Credit or Debit Card',
        edit: 'Edit',
        remove: 'Remove',
        useThisCard: 'Use This Card',
        cardIsExpired: 'This card is expired. Please update or use a different card.'
    };

    return resources[label];
}
